"""
Main AI Agent for AfroBeats Royalty Protocol

FastAPI service for plagiarism detection using mAItrix framework.
Integrates fingerprinting, similarity detection, and vector database.
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import numpy as np
import pinecone
from dotenv import load_dotenv
import os
import tempfile
import logging

from fingerprinting import AudioFingerprinter
from similarity import SimilarityDetector, SimilarityLevel

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger =logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="AfroBeats Plagiarism Detection API",
    description="AI-powered plagiarism detection for Afrobeats music",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
fingerprinter = AudioFingerprinter()
detector = SimilarityDetector()

# Initialize Pinecone (vector database)
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "")
PINECONE_ENV = os.getenv("PINECONE_ENVIRONMENT", "")
PINECONE_INDEX = os.getenv("PINECONE_INDEX_NAME", "afrobeats-fingerprints")

# Global variables for vector database
pinecone_index = None

def initialize_pinecone():
    """Initialize Pinecone vector database"""
    global pinecone_index

    if not PINECONE_API_KEY or PINECONE_API_KEY == "your_pinecone_api_key_here":
        logger.warning("Pinecone not configured. Using in-memory storage.")
        return

    try:
        pinecone.init(api_key=PINECONE_API_KEY, environment=PINECONE_ENV)

        # Create index if it doesn't exist
        if PINECONE_INDEX not in pinecone.list_indexes():
            pinecone.create_index(
                name=PINECONE_INDEX,
                dimension=128,  # Our feature vector size
                metric="cosine"
            )

        pinecone_index = pinecone.Index(PINECONE_INDEX)
        logger.info(f"Pinecone initialized: {PINECONE_INDEX}")
    except Exception as e:
        logger.error(f"Pinecone initialization failed: {e}")
        pinecone_index = None

# In-memory fallback database
memory_database: Dict[str, np.ndarray] = {}


# Pydantic models
class SimilarityResult(BaseModel):
    song_id: str
    similarity_score: float
    similarity_level: str
    fingerprint_hash: str


class PlagiarismCheckResponse(BaseModel):
    query_hash: str
    detected_matches: List[SimilarityResult]
    top_match: Optional[SimilarityResult]
    is_plagiarism: bool
    confidence: float


class RegisterSongRequest(BaseModel):
    song_id: str
    title: str
    artist: str


class RegisterSongResponse(BaseModel):
    song_id: str
    fingerprint_hash: str
    success: bool
    message: str


@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    initialize_pinecone()
    logger.info("AI Agent service started")


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "AfroBeats Plagiarism Detection",
        "version": "1.0.0",
        "database": "pinecone" if pinecone_index else "in-memory"
    }


@app.post("/api/v1/register", response_model=RegisterSongResponse)
async def register_song(
    request: RegisterSongRequest,
    audio_file: UploadFile = File(...)
):
    """
    Register a new song in the plagiarism detection database.

    Args:
        request: Song metadata
        audio_file: Audio file upload

    Returns:
        Registration response with fingerprint hash
    """
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp_file:
            content = await audio_file.read()
            tmp_file.write(content)
            tmp_path = tmp_file.name

        # Create fingerprint
        feature_vector, fingerprint_hash = fingerprinter.create_fingerprint(tmp_path)

        # Store in vector database
        if pinecone_index:
            # Store in Pinecone
            pinecone_index.upsert(vectors=[
                (request.song_id, feature_vector.tolist(), {
                    "title": request.title,
                    "artist": request.artist,
                    "fingerprint_hash": fingerprint_hash.hex()
                })
            ])
        else:
            # Store in memory
            memory_database[request.song_id] = feature_vector

        # Clean up temp file
        os.unlink(tmp_path)

        return RegisterSongResponse(
            song_id=request.song_id,
            fingerprint_hash=fingerprint_hash.hex(),
            success=True,
            message="Song registered successfully"
        )

    except Exception as e:
        logger.error(f"Registration error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/check-plagiarism", response_model=PlagiarismCheckResponse)
async def check_plagiarism(
    audio_file: UploadFile = File(...)
):
    """
    Check if an audio file contains plagiarized content.

    Args:
        audio_file: Audio file to check

    Returns:
        Plagiarism check results with similarity scores
    """
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp_file:
            content = await audio_file.read()
            tmp_file.write(content)
            tmp_path = tmp_file.name

        # Create fingerprint
        query_vector, query_hash = fingerprinter.create_fingerprint(tmp_path)

        matches = []

        if pinecone_index:
            # Query Pinecone
            results = pinecone_index.query(
                vector=query_vector.tolist(),
                top_k=10,
                include_metadata=True
            )

            for match in results.matches:
                similarity = match.score
                level = detector.classify_similarity(similarity)

                if level != SimilarityLevel.NONE:
                    matches.append(SimilarityResult(
                        song_id=match.id,
                        similarity_score=similarity,
                        similarity_level=level.name,
                        fingerprint_hash=match.metadata.get("fingerprint_hash", "")
                    ))

        else:
            # Query in-memory database
            for song_id, db_vector in memory_database.items():
                similarity = detector.cosine_similarity(query_vector, db_vector)
                level = detector.classify_similarity(similarity)

                if level != SimilarityLevel.NONE:
                    matches.append(SimilarityResult(
                        song_id=song_id,
                        similarity_score=similarity,
                        similarity_level=level.name,
                        fingerprint_hash=query_hash.hex()
                    ))

        # Sort matches by similarity
        matches.sort(key=lambda x: x.similarity_score, reverse=True)

        # Determine if plagiarism detected
        is_plagiarism = len(matches) > 0 and matches[0].similarity_score >= 0.85
        top_match = matches[0] if matches else None

        # Clean up temp file
        os.unlink(tmp_path)

        return PlagiarismCheckResponse(
            query_hash=query_hash.hex(),
            detected_matches=matches,
            top_match=top_match,
            is_plagiarism=is_plagiarism,
            confidence=top_match.similarity_score if top_match else 0.0
        )

    except Exception as e:
        logger.error(f"Plagiarism check error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/stats")
async def get_stats():
    """Get database statistics"""
    if pinecone_index:
        stats = pinecone_index.describe_index_stats()
        return {
            "total_songs": stats.total_vector_count,
            "database": "pinecone",
            "index_name": PINECONE_INDEX
        }
    else:
        return {
            "total_songs": len(memory_database),
            "database": "in-memory"
        }


if __name__ == "__main__":
    import uvicorn

    # Run server
    uvicorn.run(
        "agent:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
