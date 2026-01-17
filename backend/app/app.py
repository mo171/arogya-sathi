"""
* This file contains all the important end-points of the project

**LISTING ALL THE ENDPOINTS BELOW
  - POST /api/v1/sessions/new
  - POST /api/v1/sessions/{session_id}
  - DELETE /api/v1/sessions/{session_id}

"""

from fastapi import FastAPI
from lib.supabase_client import supabase
from dotenv import load_dotenv
import os
from lib.audio_lib import download_audio_from_url
from lib.transcript_lib import transcribe_audio
from services.session_services import (
    analyze_health_text,
    recommend_doctors,
    json_response,
)

# SETTING UP THE APP
load_dotenv()
app = FastAPI()


"""
  *below is the sample code of fetching info from supabase
  *this is not used in the project
  *review purpose only when needed

@app.get("/")
def supabase_test():
    response = supabase.table('test_users').select("*").execute()
    users = response.data
    return {"users": [u["name"] for u in users]}

"""


# ENDPOINT- /api/v1/sessions/
@app.post("/api/v1/sessions/new")
async def create_session(user_id: str):
    try:
        if not user_id:
            return {"error": "User ID is required", "status_code": 400}
        data = {
            "user_id": user_id,
        }

        result = supabase.table("health_sessions").insert(data).execute()
        session_id = result.data[0]["id"]

        return {"session_id": session_id, "status_code": 201}

    except Exception as e:
        return {"error": str(e), "status_code": 500}


@app.post("/api/v1/sessions/{session_id}")
async def process_audio(session_id: str, audio_url: str, language_code: str):
    # 1. download audio
    audio_file_path = download_audio_from_url(audio_url)

    # 2. transcribe audio
    transcript = transcribe_audio(audio_file_path, language_code)

    session_res = (
        supabase.table("health_sessions")
        .select("user_id")
        .eq("id", session_id)
        .single()
        .execute()
    )

    user_id = session_res.data["user_id"]

    user_res = (
        supabase.table("users")
        .select("allergies", "location")
        .eq("id", user_id)
        .single()
        .execute()
    )

    allergies = user_res.data["allergies"]
    location = user_res.data["location"]

    # 3. analyze medical text
    analysis = analyze_health_text(transcript, allergies)

    # 4. recommend doctors
    doctors = recommend_doctors(analysis, location)

    response = json_response(analysis, doctors)

    # 5. Save to database
    save_to_db(session_id, language_code, audio_url, transcript, analysis, doctors)

    delete_temp_file(audio_file_path)

    # 6. build structured output
    return response


def save_to_db(session_id, language_code, audio_url, transcript, analysis, doctors):
    """
    Saves the session details, analysis, and recommendations back to the Supabase health_sessions table.
    """
    try:
        data = {
            "audio_transcript": transcript,
            "detected_language": language_code,
            "analysis_result": analysis,
            "recommendations": {"doctors": doctors},
            "status": "completed",
        }

        supabase.table("health_sessions").update(data).eq("id", session_id).execute()

    except Exception as e:
        print(f"Error saving to database: {e}")


def delete_temp_file(file_path: str):
    """
    Deletes the temporary audio file from the filesystem.
    """
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"Successfully deleted temp file: {file_path}")
    except Exception as e:
        print(f"Error deleting temp file {file_path}: {e}")
