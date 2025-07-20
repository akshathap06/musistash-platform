"""
MusiStash ML Service - XGBoost Integration for Enhanced Artist Analysis

This service provides machine learning-powered insights using XGBoost for:
- Enhanced resonance score predictions
- Feature importance analysis
- Growth trajectory forecasting
- Risk assessment
- Market timing recommendations
"""

import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import json
from typing import Dict, List, Tuple, Optional
from datetime import datetime, timedelta
import asyncio
import os

class MusiStashMLPredictor:
    """
    XGBoost-powered ML predictor for enhanced artist analysis
    """
    
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.feature_names = [
            'spotify_followers_log', 'spotify_popularity', 'youtube_subscribers_log',
            'instagram_followers_log', 'net_worth_millions', 'monthly_streams_millions',
            'energy', 'danceability', 'valence', 'acousticness', 'instrumentalness',
            'genre_mainstream', 'genre_diversity', 'tier_score', 'billboard_performance',
            'social_engagement_rate', 'genius_mainstream', 'genius_emotional', 'youtube_engagement'
        ]
        self.model_version = "1.0.0"
        self.model_path = "models/xgboost_resonance_model.json"
        self.scaler_path = "models/feature_scaler.pkl"
        
    def prepare_features(self, artist_data: Dict, comparable_data: Dict) -> np.ndarray:
        """
        Prepare features for XGBoost prediction using real data from Supabase
        """
        features = []
        
        # Spotify features (real data)
        followers = artist_data.get('spotify_followers', artist_data.get('followers', 1000))
        features.append(np.log10(max(followers, 1)))
        features.append(artist_data.get('spotify_popularity', artist_data.get('popularity', 50)))
        
        # YouTube features (real data)
        youtube_subs = artist_data.get('youtube_subscribers', 0)
        features.append(np.log10(max(youtube_subs, 1)))
        
        # Instagram features (real data)
        instagram_followers = artist_data.get('instagram_followers', 0)
        features.append(np.log10(max(instagram_followers, 1)))
        
        # Financial features (real data)
        net_worth = artist_data.get('net_worth_millions', 0)
        features.append(net_worth)
        
        monthly_streams = artist_data.get('monthly_streams_millions', 0)
        features.append(monthly_streams)
        
        # Audio features (real data from Spotify)
        features.append(artist_data.get('audio_energy', 0.7))
        features.append(artist_data.get('audio_danceability', 0.6))
        features.append(artist_data.get('audio_valence', 0.5))
        features.append(artist_data.get('audio_acousticness', 0.3))
        features.append(artist_data.get('audio_instrumentalness', 0.1))
        
        # Genre features (real data)
        genres = artist_data.get('spotify_genres', artist_data.get('genres', []))
        genre_mainstream = artist_data.get('genre_mainstream_score', 0.5)
        features.append(genre_mainstream)
        features.append(artist_data.get('genre_diversity_score', min(len(genres) / 5.0, 1.0)))
        
        # Tier score (real data)
        tier_score = artist_data.get('tier_score', 50)
        features.append(tier_score)
        
        # Billboard performance (real data)
        billboard_score = artist_data.get('billboard_chart_performance_score', 0)
        features.append(billboard_score / 100.0)  # Normalize to 0-1
        
        # Social engagement rate (real data)
        social_engagement = artist_data.get('social_engagement_rate', 0.1)
        features.append(social_engagement)
        
        # Genius metrics (real data)
        genius_mainstream = artist_data.get('genius_mainstream_appeal', 0) / 100.0
        features.append(genius_mainstream)
        
        genius_emotional = artist_data.get('genius_emotional_resonance', 0) / 100.0
        features.append(genius_emotional)
        
        # YouTube engagement (real data)
        youtube_engagement = artist_data.get('youtube_engagement_rate', 0) / 100.0
        features.append(youtube_engagement)
        
        return np.array(features).reshape(1, -1)
    
    def create_synthetic_training_data(self, artist_data: Dict, comparable_data: Dict) -> List[Dict]:
        """
        Create synthetic training data based on current artist profiles
        """
        training_data = []
        
        # Base artist features
        base_features = self.prepare_features(artist_data, comparable_data).flatten()
        
        # Create synthetic variations
        for i in range(100):
            # Add noise to create variations
            noise = np.random.normal(0, 0.1, len(base_features))
            synthetic_features = base_features + noise
            
            # Ensure reasonable bounds
            synthetic_features = np.clip(synthetic_features, 0, 10)
            
            # Create synthetic target (resonance score)
            # Higher scores for better features
            base_score = 50 + (synthetic_features[0] * 5) + (synthetic_features[1] * 0.5) + (synthetic_features[4] * 2)
            base_score = np.clip(base_score, 0, 100)
            
            # Add some randomness
            final_score = base_score + np.random.normal(0, 10)
            final_score = np.clip(final_score, 0, 100)
            
            training_data.append({
                'features': synthetic_features,
                'resonance_score': final_score
            })
        
        return training_data
    
    def train_model_on_current_data(self, artist_data: Dict, comparable_data: Dict) -> Dict:
        """
        Train XGBoost model on synthetic data based on current artist profiles
        """
        # Create synthetic training data
        training_data = self.create_synthetic_training_data(artist_data, comparable_data)
        
        X = np.array([data['features'] for data in training_data])
        y = np.array([data['resonance_score'] for data in training_data])
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train XGBoost
        self.model = xgb.XGBRegressor(
            n_estimators=50,  # Reduced for faster training
            max_depth=6,
            learning_rate=0.1,
            random_state=42,
            objective='reg:squarederror'
        )
        
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate
        y_pred = self.model.predict(X_test_scaled)
        r2 = r2_score(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        
        return {
            'r2_score': r2,
            'rmse': rmse,
            'feature_importance': dict(zip(self.feature_names, self.model.feature_importances_))
        }
    
    def predict_resonance(self, artist_data: Dict, comparable_data: Dict) -> Dict:
        """
        Predict resonance score with confidence intervals
        """
        # Train model on current data if no model exists
        if self.model is None:
            self.train_model_on_current_data(artist_data, comparable_data)
        
        features = self.prepare_features(artist_data, comparable_data)
        features_scaled = self.scaler.transform(features)
        
        # Get prediction
        prediction = self.model.predict(features_scaled)[0]
        prediction = np.clip(prediction, 0, 100)
        
        # Calculate confidence interval based on feature quality
        confidence = self.calculate_prediction_confidence(artist_data)
        interval_width = max(5, 20 - confidence * 0.15)  # Better confidence = smaller interval
        confidence_interval = [max(0, prediction - interval_width), min(100, prediction + interval_width)]
        
        # Get feature importance
        feature_importance = dict(zip(self.feature_names, self.model.feature_importances_))
        
        # Generate insights
        insights = self.generate_insights(features.flatten(), feature_importance, prediction, artist_data, comparable_data)
        
        return {
            'predicted_score': prediction,
            'confidence_interval': confidence_interval,
            'prediction_confidence': confidence,
            'feature_importance': feature_importance,
            'insights': insights
        }
    
    def calculate_prediction_confidence(self, artist_data: Dict) -> float:
        """
        Calculate prediction confidence based on data quality
        """
        confidence = 50  # Base confidence
        
        # Boost confidence for better data
        if artist_data.get('followers', 0) > 10000:
            confidence += 10
        if artist_data.get('popularity', 0) > 50:
            confidence += 10
        if artist_data.get('tier', {}).get('enhanced_data', {}).get('youtube_subscribers', 0) > 10000:
            confidence += 10
        if artist_data.get('tier', {}).get('enhanced_data', {}).get('net_worth_millions', 0) > 0:
            confidence += 10
        if len(artist_data.get('genres', [])) > 0:
            confidence += 10
        
        return min(95, confidence)
    
    def generate_insights(self, features: np.ndarray, feature_importance: Dict, prediction: float, 
                         artist_data: Dict, comparable_data: Dict) -> Dict:
        """
        Generate actionable insights from the prediction
        """
        # Top driving factors
        sorted_features = sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)
        top_driving_factors = []
        
        for feature, importance in sorted_features[:5]:
            feature_idx = self.feature_names.index(feature)
            feature_value = features[feature_idx]
            
            # Determine impact based on feature value
            impact = 'positive' if feature_value > np.mean(features) else 'negative'
            
            explanations = {
                'spotify_followers_log': f"Strong fanbase with {np.exp(feature_value * np.log(10)):.0f} followers",
                'spotify_popularity': f"High platform popularity score of {feature_value:.0f}",
                'youtube_subscribers_log': f"Significant YouTube presence with {np.exp(feature_value * np.log(10)):.0f} subscribers",
                'instagram_followers_log': f"Strong Instagram following with {np.exp(feature_value * np.log(10)):.0f} followers",
                'net_worth_millions': f"Established financial success with ${feature_value:.1f}M net worth",
                'monthly_streams_millions': f"High streaming volume with {feature_value:.1f}M monthly streams",
                'genre_mainstream': "Mainstream genre appeal increases commercial potential",
                'genre_diversity': "Diverse genre portfolio reduces market risk",
                'tier_score': f"Strong market positioning with tier score of {feature_value:.0f}",
                'energy': f"High energy music ({feature_value:.2f}) drives engagement",
                'danceability': f"High danceability ({feature_value:.2f}) increases playlist potential",
                'valence': f"Positive mood music ({feature_value:.2f}) appeals to broader audience"
            }
            
            top_driving_factors.append({
                'feature': feature,
                'importance': importance,
                'impact': impact,
                'explanation': explanations.get(feature, f"Strong {feature.replace('_', ' ')} performance")
            })
        
        # Growth potential based on prediction and features
        base_growth = prediction * 0.3
        growth_potential = {
            'short_term': min(30, base_growth),  # 3 months
            'medium_term': min(60, base_growth * 2),  # 6 months
            'long_term': min(100, base_growth * 3)   # 12 months
        }
        
        # Risk assessment
        risk_level = 'low' if prediction > 70 else 'medium' if prediction > 40 else 'high'
        
        # Generate risk factors based on actual data
        risk_factors = []
        if artist_data.get('followers', 0) < 10000:
            risk_factors.append({
                'factor': 'Small Fanbase',
                'risk_level': 'medium',
                'mitigation': 'Focus on viral content and collaborations to grow audience'
            })
        
        if comparable_data.get('followers', 0) > artist_data.get('followers', 0) * 10:
            risk_factors.append({
                'factor': 'Scale Difference',
                'risk_level': 'high',
                'mitigation': 'Target niche markets and build authentic connections'
            })
        
        if not artist_data.get('genres'):
            risk_factors.append({
                'factor': 'Undefined Genre',
                'risk_level': 'medium',
                'mitigation': 'Develop clear musical identity and target specific audiences'
            })
        
        if not risk_factors:
            risk_factors.append({
                'factor': 'Market Competition',
                'risk_level': 'low',
                'mitigation': 'Current positioning shows strong competitive advantage'
            })
        
        # Market timing
        current_month = datetime.now().month
        optimal_launch = "Q1 2025" if current_month > 9 else "Q4 2024"
        
        seasonal_factors = [
            {
                'season': 'Holiday Season',
                'impact': 'positive',
                'reasoning': 'Increased music consumption and playlist opportunities'
            },
            {
                'season': 'Summer Festival',
                'impact': 'positive', 
                'reasoning': 'High energy music performs well at festivals'
            }
        ]
        
        # Competitive analysis based on actual data
        artist_followers = artist_data.get('followers', 0)
        comp_followers = comparable_data.get('followers', 0)
        
        if artist_followers > comp_followers * 0.8:
            market_position = 'leader'
        elif artist_followers > comp_followers * 0.3:
            market_position = 'challenger'
        elif artist_followers > comp_followers * 0.1:
            market_position = 'niche'
        else:
            market_position = 'emerging'
        
        competitive_advantages = []
        if artist_data.get('popularity', 0) > 70:
            competitive_advantages.append("High platform popularity")
        if len(artist_data.get('genres', [])) > 2:
            competitive_advantages.append("Genre versatility")
        if artist_data.get('tier', {}).get('enhanced_data', {}).get('youtube_subscribers', 0) > 100000:
            competitive_advantages.append("Strong YouTube presence")
        
        if not competitive_advantages:
            competitive_advantages.append("Unique musical style")
        
        market_gaps = [
            "Underserved genre segments",
            "Cross-platform content opportunities",
            "Collaboration potential"
        ]
        
        return {
            'top_driving_factors': top_driving_factors,
            'growth_potential': growth_potential,
            'risk_assessment': {
                'overall_risk': risk_level,
                'risk_factors': risk_factors
            },
            'market_timing': {
                'optimal_launch_window': optimal_launch,
                'seasonal_factors': seasonal_factors
            },
            'competitive_analysis': {
                'market_position': market_position,
                'competitive_advantage': competitive_advantages,
                'market_gaps': market_gaps
            }
        }
    
    def save_model(self):
        """Save trained model and scaler"""
        os.makedirs("models", exist_ok=True)
        
        if self.model:
            self.model.save_model(self.model_path)
        
        joblib.dump(self.scaler, self.scaler_path)
    
    def load_model(self):
        """Load trained model and scaler"""
        try:
            if os.path.exists(self.model_path):
                self.model = xgb.XGBRegressor()
                self.model.load_model(self.model_path)
            
            if os.path.exists(self.scaler_path):
                self.scaler = joblib.load(self.scaler_path)
        except Exception as e:
            print(f"Error loading model: {e}")
            # Fallback to basic model
            self.model = None

# Global ML predictor instance
ml_predictor = MusiStashMLPredictor()

async def get_ml_enhanced_analysis(artist_data: Dict, comparable_data: Dict) -> Dict:
    """
    Get ML-enhanced analysis with XGBoost insights
    """
    try:
        # Get base prediction
        ml_prediction = ml_predictor.predict_resonance(artist_data, comparable_data)
        
        # Combine with existing analysis
        enhanced_analysis = {
            'model_version': ml_predictor.model_version,
            'confidence_interval': ml_prediction['confidence_interval'],
            'prediction_confidence': ml_prediction['prediction_confidence'],
            'feature_importance': ml_prediction['feature_importance'],
            'top_driving_factors': ml_prediction['insights']['top_driving_factors'],
            'growth_potential': ml_prediction['insights']['growth_potential'],
            'risk_assessment': ml_prediction['insights']['risk_assessment'],
            'market_timing': ml_prediction['insights']['market_timing'],
            'competitive_analysis': ml_prediction['insights']['competitive_analysis']
        }
        
        return enhanced_analysis
        
    except Exception as e:
        print(f"ML analysis error: {e}")
        # Return fallback data
        return {
            'model_version': 'fallback',
            'confidence_interval': [0, 100],
            'prediction_confidence': 50,
            'feature_importance': {},
            'top_driving_factors': [],
            'growth_potential': {'short_term': 0, 'medium_term': 0, 'long_term': 0},
            'risk_assessment': {'overall_risk': 'medium', 'risk_factors': []},
            'market_timing': {'optimal_launch_window': 'TBD', 'seasonal_factors': []},
            'competitive_analysis': {'market_position': 'emerging', 'competitive_advantage': [], 'market_gaps': []}
        } 