import requests
import os
from dotenv import load_dotenv
from lib.supabase_client import supabase

# Load environment variables
load_dotenv()

BASE_URL = "http://127.0.0.1:8000"


def get_test_user():
    """Fetch a user from the database to use for testing."""
    response = supabase.table("users").select("id").limit(1).execute()
    if response.data:
        return response.data[0]["id"]
    return None


def test_create_session(user_id):
    """Test creating a new session."""
    url = f"{BASE_URL}/api/v1/sessions/new"
    params = {"user_id": user_id}
    print(f"Testing {url} with user_id={user_id}...")

    try:
        response = requests.post(url, params=params)
        response.raise_for_status()
        data = response.json()
        print(f"✅ Session Created: {data}")
        return data.get("session_id")
    except Exception as e:
        print(f"❌ Create Session Failed: {e}")
        if response:
            print(response.text)
        return None


def test_process_audio(session_id):
    """Test processing audio for a session."""
    url = f"{BASE_URL}/api/v1/sessions/{session_id}"
    # Use a sample audio URL (short, public file)
    # This is a sample MP3 file
    sample_audio_url = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"

    params = {"audio_url": sample_audio_url, "language_code": "en"}

    print(f"Testing {url} with audio_url={sample_audio_url}...")

    try:
        response = requests.post(url, params=params)
        response.raise_for_status()
        data = response.json()
        print("✅ Audio Processed Successfully!")
        print("Response Summary:")
        print(f"  - Main Problem: {data.get('main_problem')}")
        print(f"  - Bot Recommendation: {data.get('bot_recommendation')}")

        doctors = data.get("call_to_action", {}).get("recommended_doctors", [])
        print(f"  - Doctors Found: {len(doctors)}")
        for doc in doctors:
            print(
                f"    * {doc.get('name')} ({doc.get('specialization')}) - {doc.get('rating')} stars"
            )

        return True
    except Exception as e:
        print(f"❌ Process Audio Failed: {e}")
        try:
            print(response.text)
        except:
            pass
        return False


def main():
    print("🚀 Starting Backend Verification...")

    # 1. Get User
    user_id = get_test_user()
    if not user_id:
        print("❌ No users found in Supabase 'users' table. Cannot proceed.")
        return

    print(f"ℹ️  Using User ID: {user_id}")

    # 2. Create Session
    session_id = test_create_session(user_id)
    if not session_id:
        return

    # 3. Process Audio (Analyze + Recommend + Save)
    success = test_process_audio(session_id)

    if success:
        print("\n✨ Verification Completed Successfully!")
    else:
        print("\n⚠️ Verification Failed.")


if __name__ == "__main__":
    main()
