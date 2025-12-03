"""
Audio Fingerprinting Module for AfroBeats Royalty Protocol

Extracts audio features using librosa for similarity detection.
Optimized for Afrobeats genre characteristics.
"""

import librosa
import numpy as np
from typing import Dict, Tuple
import hashlib


class AudioFingerprinter:
    """
    Extract audio fingerprints from audio files using MFCC and chromagram features.
    """

    def __init__(
        self,
        sample_rate: int = 22050,
        n_mfcc: int = 20,
        n_chroma: int = 12,
        hop_length: int = 512
    ):
        """
        Initialize audio fingerprinter.

        Args:
            sample_rate: Target sample rate for audio
            n_mfcc: Number of MFCC coefficients
            n_chroma: Number of chroma bins
            hop_length: Hop length for STFT
        """
        self.sample_rate = sample_rate
        self.n_mfcc = n_mfcc
        self.n_chroma = n_chroma
        self.hop_length = hop_length

    def extract_features(self, audio_path: str) -> Dict[str, np.ndarray]:
        """
        Extract audio features from file.

        Args:
            audio_path: Path to audio file

        Returns:
            Dictionary containing audio features
        """
        # Load audio
        y, sr = librosa.load(audio_path, sr=self.sample_rate)

        # Extract MFCC (timbral characteristics)
        mfcc = librosa.feature.mfcc(
            y=y,
            sr=sr,
            n_mfcc=self.n_mfcc,
            hop_length=self.hop_length
        )

        # Extract chromagram (harmonic/melodic patterns)
        chroma = librosa.feature.chroma_stft(
            y=y,
            sr=sr,
            n_chroma=self.n_chroma,
            hop_length=self.hop_length
        )

        # Extract spectral contrast
        spectral_contrast = librosa.feature.spectral_contrast(
            y=y,
            sr=sr,
            hop_length=self.hop_length
        )

        # Extract tempo and beat features
        tempo, beats = librosa.beat.beat_track(y=y, sr=sr)

        # Extract zero crossing rate
        zcr = librosa.feature.zero_crossing_rate(y, hop_length=self.hop_length)

        # Aggregate features
        features = {
            'mfcc': mfcc,
            'chroma': chroma,
            'spectral_contrast': spectral_contrast,
            'tempo': tempo,
            'zcr': zcr,
            'duration': librosa.get_duration(y=y, sr=sr)
        }

        return features

    def create_fingerprint(self, audio_path: str) -> Tuple[np.ndarray, bytes]:
        """
        Create a compact fingerprint from audio file.

        Args:
            audio_path: Path to audio file

        Returns:
            Tuple of (feature_vector, hash)
        """
        features = self.extract_features(audio_path)

        # Aggregate MFCC features (mean and std across time)
        mfcc_mean = np.mean(features['mfcc'], axis=1)
        mfcc_std = np.std(features['mfcc'], axis=1)

        # Aggregate chroma features
        chroma_mean = np.mean(features['chroma'], axis=1)
        chroma_std = np.std(features['chroma'], axis=1)

        # Aggregate spectral contrast
        contrast_mean = np.mean(features['spectral_contrast'], axis=1)

        # Create feature vector (128 dimensions for efficient similarity search)
        feature_vector = np.concatenate([
            mfcc_mean,           # 20 dims
            mfcc_std,            # 20 dims
            chroma_mean,         # 12 dims
            chroma_std,          # 12 dims
            contrast_mean,       # 7 dims
            [features['tempo']],  # 1 dim
            [features['duration']]  # 1 dim
        ])

        # Normalize feature vector
        feature_vector = self._normalize(feature_vector)

        # Create hash for on-chain storage
        fingerprint_hash = hashlib.sha256(feature_vector.tobytes()).digest()

        return feature_vector, fingerprint_hash

    def create_fingerprint_batch(self, audio_paths: list) -> Dict[str, Tuple[np.ndarray, bytes]]:
        """
        Create fingerprints for multiple audio files.

        Args:
            audio_paths: List of audio file paths

        Returns:
            Dictionary mapping file paths to (feature_vector, hash) tuples
        """
        fingerprints = {}

        for path in audio_paths:
            try:
                vector, hash_bytes = self.create_fingerprint(path)
                fingerprints[path] = (vector, hash_bytes)
            except Exception as e:
                print(f"Error processing {path}: {e}")

        return fingerprints

    def extract_for_afrobeats(self, audio_path: str) -> Dict[str, np.ndarray]:
        """
        Extract features optimized for Afrobeats genre.

        Afrobeats characteristics:
        - Rhythm: 100-128 BPM
        - Percussive beats with polyrhythmic patterns
        - Call-and-response vocals
        - Syncopated rhythms

        Args:
            audio_path: Path to audio file

        Returns:
            Afrobeats-specific features
        """
        features = self.extract_features(audio_path)

        # Extract onset strength (important for percussive Afrobeats)
        y, sr = librosa.load(audio_path, sr=self.sample_rate)
        onset_env = librosa.onset.onset_strength(y=y, sr=sr)

        # Extract rhythm patterns
        tempogram = librosa.feature.tempogram(
            onset_envelope=onset_env,
            sr=sr,
            hop_length=self.hop_length
        )

        features['onset_strength'] = onset_env
        features['tempogram'] = tempogram

        return features

    @staticmethod
    def _normalize(vector: np.ndarray) -> np.ndarray:
        """
        Normalize feature vector to unit length.

        Args:
            vector: Input feature vector

        Returns:
            Normalized vector
        """
        norm = np.linalg.norm(vector)
        if norm == 0:
            return vector
        return vector / norm

    def save_fingerprint(self, feature_vector: np.ndarray, output_path: str):
        """
        Save fingerprint to file.

        Args:
            feature_vector: Feature vector to save
            output_path: Output file path
        """
        np.save(output_path, feature_vector)

    @staticmethod
    def load_fingerprint(input_path: str) -> np.ndarray:
        """
        Load fingerprint from file.

        Args:
            input_path: Input file path

        Returns:
            Loaded feature vector
        """
        return np.load(input_path)


# Example usage
if __name__ == "__main__":
    # Initialize fingerprinter
    fingerprinter = AudioFingerprinter()

    # Example: Create fingerprint from audio file
    # audio_file = "path/to/afrobeats_song.mp3"
    # feature_vector, fingerprint_hash = fingerprinter.create_fingerprint(audio_file)

    # print(f"Feature vector shape: {feature_vector.shape}")
    # print(f"Fingerprint hash: {fingerprint_hash.hex()}")

    print("Audio Fingerprinting module ready!")
