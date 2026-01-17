import os
from openai import OpenAI

def transcribe_audio(audio_file_path: str, language_code: str) -> str:
    """
    Transcribes an audio file into text using OpenAI's Whisper API (whisper-1).
    """
    try:
        if not os.path.exists(audio_file_path):
            raise FileNotFoundError(f"Audio file not found: {audio_file_path}")

        # Initialize the client
        # It will automatically look for OPENAI_API_KEY in the environment
        client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        
        # Open the file for reading in binary mode
        with open(audio_file_path, "rb") as audio_file:
            # Call the transcription API
            response = client.audio.transcriptions.create(
                model="whisper-1", 
                file=audio_file,
                language="en"
            )
        
        return response.text.strip()

    except Exception as e:
        print(f"Error during API transcription: {e}")
        raise e
