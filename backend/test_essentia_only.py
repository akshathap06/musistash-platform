import sys
from enhanced_audio_analysis import EnhancedAudioAnalyzer
import asyncio

async def main(mp3_path):
    analyzer = EnhancedAudioAnalyzer()
    results = await analyzer._analyze_with_essentia(mp3_path)
    print('Essentia features:')
    for k, v in results.items():
        print(f'{k}: {v}')

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python test_essentia_only.py <path_to_mp3>')
        sys.exit(1)
    mp3_path = sys.argv[1]
    asyncio.run(main(mp3_path)) 