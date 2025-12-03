"""
Royalty Prediction Service for Smart Contract Oracle Integration

Fetches historical streaming data, runs ML predictions,
and submits to RoyaltyStreamOracle contract.
"""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import List, Dict
from web3 import Web3
from eth_account import Account
import json

from predictions import RoyaltyPredictor

logger = logging.getLogger(__name__)


class OraclePredictionService:
    """
    Service to fetch data, run predictions, and submit to blockchain.
    """

    def __init__(self, config: Dict):
        """
        Initialize service.

        Args:
            config: Configuration dict with RPC, private key, contract addresses
        """
        self.w3 = Web3(Web3.HTTPProvider(config['rpc_url']))
        self.account = Account.from_key(config['private_key'])
        
        # Load contract ABIs
        with open('contracts/lending/RoyaltyStreamOracle.json', 'r') as f:
            oracle_abi = json.load(f)['abi']

        with open('contracts/core/RoyaltyDistributionEngine.json', 'r') as f:
            engine_abi = json.load(f)['abi']

        # Initialize contracts
        self.oracle_contract = self.w3.eth.contract(
            address=config['oracle_address'],
            abi=oracle_abi
        )

        self.royalty_engine = self.w3.eth.contract(
            address=config['royalty_engine_address'],
            abi=engine_abi
        )

        # Initialize predictor
        self.predictor = RoyaltyPredictor(
            rate_per_stream=config.get('rate_per_stream', 0.003)
        )

        logger.info("Oracle Prediction Service initialized")

    async def fetch_historical_data(self, token_id: int) -> List[Dict]:
        """
        Fetch historical streaming data for a token.

        Args:
            token_id: Token ID

        Returns:
            List of {date, streams} dicts
        """
        try:
            # Get streaming data from contract
            streaming_data = self.royalty_engine.functions.getStreamingData(token_id).call()

            total_streams = streaming_data[0]
            last_update = streaming_data[1]

            # For MVP: Generate synthetic daily distribution
            # In production: Fetch actual daily data from database
            days_active = max(1, (datetime.now().timestamp() - last_update) // 86400)

            avg_daily = total_streams // days_active if days_active > 0 else 0

            historical = []
            for i in range(int(days_active)):
                date = datetime.fromtimestamp(last_update + (i * 86400))
                # Add some variance
                streams = int(avg_daily * (0.9 + (i % 10) * 0.02))
                
                historical.append({
                    'date': date.strftime('%Y-%m-%d'),
                    'streams': streams
                })

            logger.info(f"Fetched {len(historical)} days of data for token {token_id}")
            
            return historical

        except Exception as e:
            logger.error(f"Error fetching data for token {token_id}: {e}")
            return []

    async def predict_and_submit(
        self,
        token_id: int,
        duration_days: int = 180
    ):
        """
        Run prediction and submit to oracle contract.

        Args:
            token_id: Token ID
            duration_days: Prediction duration (default 6 months)
        """
        try:
            # Fetch historical data
            historical = await self.fetch_historical_data(token_id)

            if not historical:
                logger.warning(f"No data for token {token_id}, skipping")
                return

            # Run prediction
            projected_earnings, confidence = self.predictor.predict_earnings(
                token_id=token_id,
                historical_streams=historical,
                duration_days=duration_days
            )

            # Convert to wei (6 decimals for USDT/USDC)
            projected_amount_wei = int(projected_earnings * 1e6)
            confidence_bp = int(confidence * 10000)  # Convert to basis points

            duration_seconds = duration_days * 86400

            logger.info(
                f"Token {token_id}: ${projected_earnings:.2f} over {duration_days} days "
                f"(confidence: {confidence:.2%})"
            )

            # Submit to contract
            tx = self.oracle_contract.functions.submitPrediction(
                token_id,
                projected_amount_wei,
                confidence_bp,
                duration_seconds
            ).build_transaction({
                'from': self.account.address,
                'nonce': self.w3.eth.get_transaction_count(self.account.address),
                'gas': 200000,
                'gasPrice': self.w3.eth.gas_price
            })

            signed_tx = self.account.sign_transaction(tx)
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)

            logger.info(f"Submitted prediction for token {token_id}: {tx_hash.hex()}")

            # Wait for confirmation
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            logger.info(f"Transaction confirmed in block {receipt['blockNumber']}")

        except Exception as e:
            logger.error(f"Error submitting prediction for token {token_id}: {e}")

    async def batch_predict_and_submit(self, token_ids: List[int]):
        """
        Batch predict and submit for multiple tokens.

        Args:
            token_ids: List of token IDs
        """
        predictions = []

        for token_id in token_ids:
            historical = await self.fetch_historical_data(token_id)
            
            if historical:
                predictions.append({
                    'token_id': token_id,
                    'historical_streams': historical,
                    'duration_days': 180
                })

        if not predictions:
            logger.warning("No tokens to predict")
            return

        # Run batch prediction
        results = self.predictor.batch_predict(predictions)

        # Prepare batch submission
        token_ids_batch = []
        projected_amounts = []
        confidences = []
        durations = []

        for result in results:
            token_ids_batch.append(result['token_id'])
            projected_amounts.append(int(result['projected_earnings'] * 1e6))
            confidences.append(int(result['confidence'] * 10000))
            durations.append(result['duration_days'] * 86400)

        try:
            # Submit batch
            tx = self.oracle_contract.functions.batchSubmitPredictions(
                token_ids_batch,
                projected_amounts,
                confidences,
                durations
            ).build_transaction({
                'from': self.account.address,
                'nonce': self.w3.eth.get_transaction_count(self.account.address),
                'gas': 500000,  # Higher gas for batch
                'gasPrice': self.w3.eth.gas_price
            })

            signed_tx = self.account.sign_transaction(tx)
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)

            logger.info(f"Submitted batch prediction: {tx_hash.hex()}")

            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            logger.info(f"Batch confirmed in block {receipt['blockNumber']}")

        except Exception as e:
            logger.error(f"Batch submission error: {e}")

    async def run_periodic_updates(self, interval_hours: int = 24):
        """
        Run periodic prediction updates.

        Args:
            interval_hours: Update interval in hours
        """
        while True:
            try:
                logger.info("Starting periodic prediction update...")

                # Get all active tokens
                # For MVP: Use hardcoded list
                # In production: Query from contract
                token_ids = [0, 1, 2]  # Example tokens

                await self.batch_predict_and_submit(token_ids)

                logger.info(f"Predictions updated. Sleeping for {interval_hours} hours...")

                await asyncio.sleep(interval_hours * 3600)

            except Exception as e:
                logger.error(f"Error in periodic update: {e}")
                await asyncio.sleep(300)  # Retry after 5 minutes


# Example usage
if __name__ == "__main__":
    import os
    from dotenv import load_dotenv

    load_dotenv()

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    config = {
        'rpc_url': os.getenv('CAMP_TESTNET_RPC'),
        'private_key': os.getenv('ORACLE_PRIVATE_KEY'),
        'oracle_address': os.getenv('ROYALTY_ORACLE_ADDRESS'),
        'royalty_engine_address': os.getenv('ROYALTY_ENGINE_ADDRESS'),
        'rate_per_stream': 0.003
    }

    service = OraclePredictionService(config)

    # Run periodic updates
    asyncio.run(service.run_periodic_updates(interval_hours=24))
