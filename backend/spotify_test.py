import os
from dotenv import load_dotenv
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import requests

load_dotenv()

auth_manager = SpotifyClientCredentials(
    client_id=os.getenv("SPOTIFY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIFY_CLIENT_SECRET")
)
sp = spotipy.Spotify(auth_manager=auth_manager)

# Print the current access token
try:
    token_info = auth_manager.get_access_token(as_dict=True)
    print("ACCESS TOKEN:", token_info['access_token'])
except Exception as e:
    print("Could not get access token:", e)

# Try searching for a popular artist and getting details for their top track
results = sp.search(q='artist:Drake', type='artist', limit=1)
print("Artist search results:", results)

artist_id = results['artists']['items'][0]['id']
top_tracks = sp.artist_top_tracks(artist_id)
track_ids = [track['id'] for track in top_tracks['tracks']]
print("Top track IDs:", track_ids)

# Fetch details for the first top track
track = sp.track(track_ids[0])
print("First top track details:", track)

# Test audio features for the first track
try:
    audio_features = sp.audio_features([track_ids[0]])
    print("Audio features for first track:", audio_features)
except Exception as e:
    print("Error fetching audio features for first track:", e)

# Test audio features for up to 5 tracks
try:
    audio_features_batch = sp.audio_features(track_ids[:5])
    print("Audio features for first 5 tracks:", audio_features_batch)
except Exception as e:
    print("Error fetching audio features for first 5 tracks:", e)

BASE_URL = 'http://localhost:8000'

artists = ['Drake', 'Taylor Swift', 'Billie Eilish']

print('--- Testing /analyze-artist/{artist_name} ---')
for artist in artists:
    url = f"{BASE_URL}/analyze-artist/{artist}"
    try:
        resp = requests.get(url, timeout=10)
        print(f"[analyze-artist] {artist}: Status {resp.status_code}")
        try:
            print(resp.json())
        except Exception as e:
            print(f"Error parsing JSON: {e}")
            print(resp.text)
    except Exception as e:
        print(f"Error calling {url}: {e}")
    print('-' * 40)

print('--- Testing /artist-stats/{artist_name} ---')
for artist in artists:
    url = f"{BASE_URL}/artist-stats/{artist}"
    try:
        resp = requests.get(url, timeout=10)
        print(f"[artist-stats] {artist}: Status {resp.status_code}")
        try:
            print(resp.json())
        except Exception as e:
            print(f"Error parsing JSON: {e}")
            print(resp.text)
    except Exception as e:
        print(f"Error calling {url}: {e}")
    print('-' * 40)

# --- Direct Billboard API Test ---
print('--- Testing Billboard API (python-billboard) ---')
try:
    import billboard
    chart = billboard.ChartData('hot-100', timeout=10)
    print('Top 5 Billboard Hot 100:')
    for i, entry in enumerate(chart[:5]):
        print(f"#{entry.rank}: {entry.title} by {entry.artist}")
except Exception as e:
    print(f"Billboard API error: {e}")
print('-' * 40)

# --- Direct Last.fm API Test ---
print('--- Testing Last.fm API ---')
lastfm_api_key = os.getenv('LASTFM_API_KEY')
if not lastfm_api_key:
    print('No LASTFM_API_KEY found in environment.')
else:
    for artist in artists:
        url = f"https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist={artist}&api_key={lastfm_api_key}&format=json"
        try:
            resp = requests.get(url, timeout=10)
            print(f"[Last.fm] {artist}: Status {resp.status_code}")
            try:
                print(resp.json())
            except Exception as e:
                print(f"Error parsing JSON: {e}")
                print(resp.text)
        except Exception as e:
            print(f"Error calling Last.fm for {artist}: {e}")
        print('-' * 20)