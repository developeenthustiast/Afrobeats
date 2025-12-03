"""
ML-Based Royalty Earnings Prediction Service

Uses Prophet (Facebook's time series forecasting) to predict future
royalty earnings based on historical streaming data.
"""

import numpy as np
import pandas as pd
from prophet import Prophet
from datetime import datetime, timedelta
from typing import Tuple, Dict, List
import logging

logger = logging.getLogger(__name__)


class RoyaltyPredictor:
    """
    Predict future royalty earnings using Prophet time series model.
    """

    def __init__(self, rate_per_stream: float = 0.003):
        """
        Initialize predictor.

        Args:
            rate_per_stream: Revenue per stream in USD
        """
        self.rate_per_stream = rate_per_stream
        self.models = {}  # Cache models per token

    def prepare_data(
        self,
        historical_streams: List[Dict],
        token_id: int
    ) -> pd.DataFrame:
        """
        Prepare historical streaming data for Prophet.

        Args:
            historical_streams: List of {date, streams} dicts
            token_id: Token ID for logging

        Returns:
            DataFrame with 'ds' (date) and 'y' (streams) columns
        """
        if not historical_streams:
            logger.warning(f"No historical data for token {token_id}")
            return pd.DataFrame(columns=['ds', 'y'])

        df = pd.DataFrame(historical_streams)
        
        # Prophet requires 'ds' (datestamp) and 'y' (value) columns
        df['ds'] = pd.to_datetime(df['date'])
        df['y'] = df['streams'].astype(float)

        # Sort by date
        df = df.sort_values('ds')

        logger.info(f"Prepared {len(df)} data points for token {token_id}")
        
        return df[['ds', 'y']]

    def train_model(
        self,
        historical_data: pd.DataFrame,
        seasonality: bool = True
    ) -> Prophet:
        """
        Train Prophet model on historical data.

        Args:
            historical_data: DataFrame with 'ds' and 'y'
            seasonality: Whether to include seasonality components

        Returns:
            Trained Prophet model
        """
        model = Prophet(
            daily_seasonality=False,
            weekly_seasonality=seasonality,
            yearly_seasonality=seasonality,
            changepoint_prior_scale=0.05,  # Flexibility for trend changes
            seasonality_prior_scale=10.0,
            interval_width=0.95  # 95% confidence intervals
        )

        # Fit model
        model.fit(historical_data)

        return model

    def predict_earnings(
        self,
        token_id: int,
        historical_streams: List[Dict],
        duration_days: int,
        use_cache: bool = True
    ) -> Tuple[float, float]:
        """
        Predict future earnings for a token.

        Args:
            token_id: Token ID
            historical_streams: Historical streaming data
            duration_days: Number of days to predict
            use_cache: Whether to use cached model

        Returns:
            Tuple of (projected_earnings, confidence_score)
        """
        try:
            # Prepare data
            df = self.prepare_data(historical_streams, token_id)

            if len(df) < 7:  # Need at least 1 week of data
                logger.warning(f"Insufficient data for token {token_id}, using fallback")
                return self._fallback_prediction(df, duration_days)

            # Train or use cached model
            if use_cache and token_id in self.models:
                model = self.models[token_id]
                logger.info(f"Using cached model for token {token_id}")
            else:
                model = self.train_model(df)
                self.models[token_id] = model
                logger.info(f"Trained new model for token {token_id}")

            # Make future dataframe
            future = model.make_future_dataframe(periods=duration_days, freq='D')

            # Predict
            forecast = model.predict(future)

            # Get future predictions only
            future_forecast = forecast.tail(duration_days)

            # Calculate projected total streams
            projected_streams = future_forecast['yhat'].sum()

            # Ensure non-negative
            projected_streams = max(0, projected_streams)

            # Calculate earnings
            projected_earnings = projected_streams * self.rate_per_stream

            # Calculate confidence based on prediction intervals
            # Narrower intervals = higher confidence
            avg_uncertainty = (
                future_forecast['yhat_upper'] - future_forecast['yhat_lower']
            ).mean()

            avg_prediction = future_forecast['yhat'].mean()

            if avg_prediction > 0:
                uncertainty_ratio = avg_uncertainty / avg_prediction
                # Convert to confidence score (0-1)
                # Lower uncertainty = higher confidence
                confidence = max(0.3, min(1.0, 1.0 - (uncertainty_ratio * 0.5)))
            else:
                confidence = 0.5  # Default moderate confidence

            logger.info(
                f"Token {token_id}: Predicted ${projected_earnings:.2f} "
                f"over {duration_days} days (confidence: {confidence:.2%})"
            )

            return (projected_earnings, confidence)

        except Exception as e:
            logger.error(f"Prediction error for token {token_id}: {e}")
            return self._fallback_prediction(df, duration_days)

    def _fallback_prediction(
        self,
        df: pd.DataFrame,
        duration_days: int
    ) -> Tuple[float, float]:
        """
        Simple linear fallback when Prophet fails.

        Args:
            df: Historical data
            duration_days: Days to predict

        Returns:
            Tuple of (projected_earnings, confidence)
        """
        if len(df) == 0:
            return (0.0, 0.0)

        # Calculate average daily streams
        avg_daily_streams = df['y'].mean()

        # Project
        projected_streams = avg_daily_streams * duration_days
        projected_earnings = projected_streams * self.rate_per_stream

        # Lower confidence for fallback
        confidence = 0.5

        logger.info(f"Fallback prediction: ${projected_earnings:.2f}")

        return (projected_earnings, confidence)

    def batch_predict(
        self,
        predictions: List[Dict]
    ) -> List[Dict]:
        """
        Batch predict for multiple tokens.

        Args:
            predictions: List of {token_id, historical_streams, duration_days}

        Returns:
            List of {token_id, projected_earnings, confidence}
        """
        results = []

        for pred in predictions:
            token_id = pred['token_id']
            historical_streams = pred['historical_streams']
            duration_days = pred['duration_days']

            earnings, confidence = self.predict_earnings(
                token_id,
                historical_streams,
                duration_days
            )

            results.append({
                'token_id': token_id,
                'projected_earnings': earnings,
                'confidence': confidence,
                'duration_days': duration_days,
                'timestamp': datetime.now().isoformat()
            })

        return results

    def analyze_growth_trend(
        self,
        historical_data: pd.DataFrame
    ) -> Dict:
        """
        Analyze growth trend from historical data.

        Args:
            historical_data: DataFrame with 'ds' and 'y'

        Returns:
            Dict with growth metrics
        """
        if len(historical_data) < 14:
            return {'growth_rate': 0.0, 'trend': 'insufficient_data'}

        # Calculate 7-day and 30-day growth rates
        recent_7d = historical_data.tail(7)['y'].mean()
        previous_7d = historical_data.tail(14).head(7)['y'].mean()

        if previous_7d > 0:
            growth_rate_7d = ((recent_7d - previous_7d) / previous_7d) * 100
        else:
            growth_rate_7d = 0.0

        # Determine trend
        if growth_rate_7d > 10:
            trend = 'growing'
        elif growth_rate_7d < -10:
            trend = 'declining'
        else:
            trend = 'stable'

        return {
            'growth_rate_7d': growth_rate_7d,
            'trend': trend,
            'recent_avg': recent_7d,
            'previous_avg': previous_7d
        }


# Example usage
if __name__ == "__main__":
    # Configure logging
    logging.basicConfig(level=logging.INFO)

    # Initialize predictor
    predictor = RoyaltyPredictor(rate_per_stream=0.003)

    # Example historical data (date, streams)
    historical_data = [
        {'date': '2025-10-01', 'streams': 1000},
        {'date': '2025-10-02', 'streams': 1100},
        {'date': '2025-10-03', 'streams': 1200},
        {'date': '2025-10-04', 'streams': 1150},
        {'date': '2025-10-05', 'streams': 1300},
        {'date': '2025-10-06', 'streams': 1400},
        {'date': '2025-10-07', 'streams': 1350},
        # ... more data
    ]

    # Predict for 180 days (6 months)
    earnings, confidence = predictor.predict_earnings(
        token_id=1,
        historical_streams=historical_data,
        duration_days=180
    )

    print(f"Projected earnings: ${earnings:.2f}")
    print(f"Confidence: {confidence:.2%}")
