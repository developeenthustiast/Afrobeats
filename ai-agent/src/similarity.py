"""
Similarity Detection Module for AfroBeats Royalty Protocol

Compare audio fingerprints and detect potential plagiarism.
Uses cosine similarity and Dynamic Time Warping (DTW).
"""

import numpy as np
from scipy.spatial.distance import cosine
from scipy.spatial.distance import euclidean
from typing import Tuple, List, Dict
from enum import Enum


class SimilarityLevel(Enum):
    """Similarity threshold levels"""
    HIGH = 0.95      # 95% - Very likely plagiarism
    MEDIUM = 0.90    # 90% - Potential plagiarism
    LOW = 0.85       # 85% - Suspicious similarity
    NONE = 0.0       # Below threshold


class SimilarityDetector:
    """
    Detect similarity between audio fingerprints using multiple algorithms.
    """

    def __init__(
        self,
        high_threshold: float = 0.95,
        medium_threshold: float = 0.90,
        low_threshold: float = 0.85
    ):
        """
        Initialize similarity detector.

        Args:
            high_threshold: Threshold for high similarity (95%)
            medium_threshold: Threshold for medium similarity (90%)
            low_threshold: Threshold for low similarity (85%)
        """
        self.high_threshold = high_threshold
        self.medium_threshold = medium_threshold
        self.low_threshold = low_threshold

    def cosine_similarity(
        self,
        vector1: np.ndarray,
        vector2: np.ndarray
    ) -> float:
        """
        Calculate cosine similarity between two vectors.

        Args:
            vector1: First feature vector
            vector2: Second feature vector

        Returns:
            Similarity score (0-1)
        """
        # Cosine similarity = 1 - cosine distance
        similarity = 1 - cosine(vector1, vector2)
        return max(0.0, min(1.0, similarity))  # Clamp to [0, 1]

    def euclidean_distance(
        self,
        vector1: np.ndarray,
        vector2: np.ndarray
    ) -> float:
        """
        Calculate Euclidean distance between two vectors.

        Args:
            vector1: First feature vector
            vector2: Second feature vector

        Returns:
            Distance score (lower is more similar)
        """
        return euclidean(vector1, vector2)

    def dtw_distance(
        self,
        seq1: np.ndarray,
        seq2: np.ndarray
    ) -> float:
        """
        Calculate Dynamic Time Warping distance between two time series.
        Useful for temporal alignment of audio features.

        Args:
            seq1: First time series
            seq2: Second time series

        Returns:
            DTW distance (lower is more similar)
        """
        n, m = len(seq1), len(seq2)
        dtw = np.zeros((n + 1, m + 1))

        # Initialize
        for i in range(1, n + 1):
            dtw[i][0] = float('inf')
        for j in range(1, m + 1):
            dtw[0][j] = float('inf')
        dtw[0][0] = 0

        # Compute DTW
        for i in range(1, n + 1):
            for j in range(1, m + 1):
                cost = abs(seq1[i - 1] - seq2[j - 1])
                dtw[i][j] = cost + min(
                    dtw[i - 1][j],      # Insertion
                    dtw[i][j - 1],      # Deletion
                    dtw[i - 1][j - 1]   # Match
                )

        return dtw[n][m]

    def compare_fingerprints(
        self,
        fingerprint1: np.ndarray,
        fingerprint2: np.ndarray,
        use_dtw: bool = False
    ) -> Dict[str, float]:
        """
        Compare two audio fingerprints.

        Args:
            fingerprint1: First audio fingerprint
            fingerprint2: Second audio fingerprint
            use_dtw: Whether to use DTW for temporal alignment

        Returns:
            Dictionary with similarity metrics
        """
        results = {}

        # Cosine similarity (primary metric)
        results['cosine_similarity'] = self.cosine_similarity(fingerprint1, fingerprint2)

        # Euclidean distance (secondary metric)
        results['euclidean_distance'] = self.euclidean_distance(fingerprint1, fingerprint2)

        # DTW distance (optional, for time series)
        if use_dtw:
            results['dtw_distance'] = self.dtw_distance(fingerprint1, fingerprint2)

        return results

    def classify_similarity(self, similarity_score: float) -> SimilarityLevel:
        """
        Classify similarity score into levels.

        Args:
            similarity_score: Similarity score (0-1)

        Returns:
            SimilarityLevel enum
        """
        if similarity_score >= self.high_threshold:
            return SimilarityLevel.HIGH
        elif similarity_score >= self.medium_threshold:
            return SimilarityLevel.MEDIUM
        elif similarity_score >= self.low_threshold:
            return SimilarityLevel.LOW
        else:
            return SimilarityLevel.NONE

    def detect_plagiarism(
        self,
        query_fingerprint: np.ndarray,
        database_fingerprints: Dict[str, np.ndarray]
    ) -> List[Tuple[str, float, SimilarityLevel]]:
        """
        Detect potential plagiarism by comparing against database.

        Args:
            query_fingerprint: Query audio fingerprint
            database_fingerprints: Dictionary of {song_id: fingerprint}

        Returns:
            List of (song_id, similarity, level) tuples, sorted by similarity
        """
        matches = []

        for song_id, db_fingerprint in database_fingerprints.items():
            # Calculate similarity
            similarity = self.cosine_similarity(query_fingerprint, db_fingerprint)

            # Classify similarity level
            level = self.classify_similarity(similarity)

            # Only include matches above low threshold
            if level != SimilarityLevel.NONE:
                matches.append((song_id, similarity, level))

        # Sort by similarity (descending)
        matches.sort(key=lambda x: x[1], reverse=True)

        return matches

    def generate_evidence_package(
        self,
        query_id: str,
        match_id: str,
        similarity_score: float,
        level: SimilarityLevel
    ) -> Dict:
        """
        Generate evidence package for dispute resolution.

        Args:
            query_id: Query song ID
            match_id: Matched song ID
            similarity_score: Similarity score
            level: Similarity level

        Returns:
            Evidence package dictionary
        """
        evidence = {
            'query_song_id': query_id,
            'matched_song_id': match_id,
            'similarity_score': similarity_score,
            'similarity_level': level.name,
            'threshold_exceeded': level != SimilarityLevel.NONE,
            'recommendation': self._get_recommendation(level),
            'metadata': {
                'algorithm': 'cosine_similarity',
                'feature_dimension': '128d',
                'high_threshold': self.high_threshold,
                'medium_threshold': self.medium_threshold,
                'low_threshold': self.low_threshold
            }
        }

        return evidence

    def batch_search(
        self,
        query_fingerprint: np.ndarray,
        database_fingerprints: Dict[str, np.ndarray],
        top_k: int = 10
    ) -> List[Tuple[str, float]]:
        """
        Efficient batch search for top K similar songs.

        Args:
            query_fingerprint: Query audio fingerprint
            database_fingerprints: Dictionary of {song_id: fingerprint}
            top_k: Number of top results to return

        Returns:
            List of (song_id, similarity) tuples
        """
        similarities = []

        for song_id, db_fingerprint in database_fingerprints.items():
            similarity = self.cosine_similarity(query_fingerprint, db_fingerprint)
            similarities.append((song_id, similarity))

        # Sort and return top K
        similarities.sort(key=lambda x: x[1], reverse=True)
        return similarities[:top_k]

    @staticmethod
    def _get_recommendation(level: SimilarityLevel) -> str:
        """
        Get recommendation based on similarity level.

        Args:
            level: Similarity level

        Returns:
            Recommendation string
        """
        recommendations = {
            SimilarityLevel.HIGH: "FLAG FOR MANUAL REVIEW - Very high similarity detected. Potential copyright infringement.",
            SimilarityLevel.MEDIUM: "INVESTIGATE - Significant similarity detected. May require further analysis.",
            SimilarityLevel.LOW: "MONITOR - Some similarity detected. Consider additional verification.",
            SimilarityLevel.NONE: "APPROVED - No significant similarity detected."
        }

        return recommendations[level]


# Example usage
if __name__ == "__main__":
    # Initialize detector
    detector = SimilarityDetector()

    # Example: Compare two random vectors
    vec1 = np.random.rand(128)
    vec2 = np.random.rand(128)

    similarity = detector.cosine_similarity(vec1, vec2)
    level = detector.classify_similarity(similarity)

    print(f"Similarity: {similarity:.4f}")
    print(f"Level: {level.name}")
    print(f"Recommendation: {detector._get_recommendation(level)}")

    print("\nSimilarity Detection module ready!")
