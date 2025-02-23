from mitmproxy import http
import json
import re

def response(flow: http.HTTPFlow) -> None:
    """Intercept and extract YouTube video information."""
    
    url = flow.request.pretty_url

    # Detect YouTube video watch page
    if "youtube.com/watch" in url:
        print(f"🎥 YouTube Video Watched: {url}")

    # Detect YouTube API request fetching video data
    if "youtubei/v1/player" in url:
        try:
            data = json.loads(flow.response.text)
            video_id = data.get("videoId", "Unknown")
            title = data.get("videoDetails", {}).get("title", "Unknown Title")
            print(f"🎥 YouTube API Video: {title} (ID: {video_id})")
        except:
            print(f"⚠️ Failed to parse YouTube API response: {url}")

    # Detect YouTube video streaming requests
    if "googlevideo.com" in url:
        print(f"📡 Streaming from Google Video: {url}")

addons = [
    response
]
