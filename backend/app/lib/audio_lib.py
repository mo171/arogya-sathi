import os
import uuid
import requests
from pathlib import Path
from openai import OpenAI

def download_audio_from_url(audio_url: str) -> str:
    """
    Downloads an audio file from a given URL and saves it to a temporary directory.
    Returns the absolute path to the downloaded file.
    """
    try:
        # Define the temp directory path relative to this file
        # backend/app/lib/audio.lib.py -> backend/app/temp
        base_dir = Path(__file__).parent.parent
        temp_dir = base_dir / "temp"
        
        # Ensure the temp directory exists
        temp_dir.mkdir(parents=True, exist_ok=True)
        
        # Get file extension from URL or default to .mp3
        parsed_url = audio_url.split("?")[0]
        extension = Path(parsed_url).suffix or ".mp3"
        
        # Generate a unique filename
        filename = f"{uuid.uuid4()}{extension}"
        file_path = temp_dir / filename
        
        # Download the file
        response = requests.get(audio_url, stream=True)
        response.raise_for_status()
        
        with open(file_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        
        return str(file_path.absolute())

    except Exception as e:
        print(f"Error downloading audio: {e}")
        raise e
