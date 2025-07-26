"""
Audio Analysis Factory
Manages different audio analysis implementations based on environment and availability
"""

import os
from typing import Dict, Any, Optional

class AudioAnalysisFactory:
    """
    Factory class to provide appropriate audio analyzer based on environment
    """
    
    @staticmethod
    def get_analyzer():
        """
        Get the appropriate audio analyzer based on environment variables
        """
        mode = os.getenv('AUDIO_ANALYSIS_MODE', 'simplified')
        enable_full = os.getenv('ENABLE_FULL_AUDIO_ANALYSIS', 'false').lower() == 'true'
        
        print(f"🔧 Audio Analysis Factory: Mode={mode}, Enable Full={enable_full}")
        
        # Try full analysis if enabled
        if mode == 'full' or enable_full:
            try:
                print("🎵 Attempting to load full audio analysis...")
                from full_audio_analysis import full_analyzer
                print("✅ Full audio analysis loaded successfully")
                return full_analyzer
            except ImportError as e:
                print(f"⚠️ Full audio analysis not available: {e}")
                print("🔄 Falling back to simplified analysis")
                from simplified_audio_analysis import simplified_analyzer
                return simplified_analyzer
            except Exception as e:
                print(f"❌ Error loading full audio analysis: {e}")
                print("🔄 Falling back to simplified analysis")
                from simplified_audio_analysis import simplified_analyzer
                return simplified_analyzer
        
        # Use simplified analysis
        else:
            print("🎵 Using simplified audio analysis")
            from simplified_audio_analysis import simplified_analyzer
            return simplified_analyzer
    
    @staticmethod
    def get_analysis_capabilities() -> Dict[str, Any]:
        """
        Get information about available analysis capabilities
        """
        try:
            analyzer = AudioAnalysisFactory.get_analyzer()
            return {
                "mode": os.getenv('AUDIO_ANALYSIS_MODE', 'simplified'),
                "enable_full": os.getenv('ENABLE_FULL_AUDIO_ANALYSIS', 'false').lower() == 'true',
                "analyzer_type": type(analyzer).__name__,
                "available_libraries": getattr(analyzer, 'available_libraries', {}),
                "analysis_quality": "full" if "librosa" in getattr(analyzer, 'available_libraries', {}) else "simplified"
            }
        except Exception as e:
            return {
                "mode": "error",
                "enable_full": False,
                "analyzer_type": "error",
                "available_libraries": {},
                "analysis_quality": "error",
                "error": str(e)
            } 