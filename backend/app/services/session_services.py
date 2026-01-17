from lib.llm_lib import get_structured_analysis
from lib.schema_lib import HealthAnalysisSchema
from lib.supabase_client import supabase


def analyze_health_text(transcript: str, allergies: str):
    """
    Analyzes health text using a high-accuracy RAG approach:
    1. Extract a precise search query from the transcript.
    2. Retrieve community solutions from Supabase.
    3. Generate the final analysis using a structured professional prompt.
    """
    try:
        full_prompt = f"""
SYSTEM INSTRUCTIONS:
You are a professional Doctor at Arogya-Sathi.

PATIENT MESSAGE:
{transcript}

PATIENT ALLERGIES
{allergies}

TASK:
1. Extract the main problem, cause, and preventive measures (suggest tablets considering allergies).
2. Determine the correctly matching 'required_specialization' (e.g. Dermatologist, Cardiologist, ENT, General Physician) based on the problem.
3. Provide a 'bot_recommendation' whether to go with home remedies or not (straight forward recommended/not recommended).
4. Provide a final 'response' detailing what the patient should do and if they should meet a doctor.
"""

        # Final structured analysis call
        analysis = get_structured_analysis(
            transcript, full_prompt, HealthAnalysisSchema
        )

        solutions_query = (
            supabase.table("community_solutions")
            .select("*")
            .ilike("problem_name", f"%{analysis.main_problem}%")
            .limit(3)
            .execute()
        )

        return {
            "main_problem": analysis.main_problem,
            "cause_of_problem": analysis.cause_of_problem,
            "preventive_measures": [
                m.strip().lstrip("-*•").strip()
                for m in analysis.preventive_measures.split("\n")
                if m.strip()
            ],
            "required_specialization": analysis.required_specialization,
            "bot_recommendation": analysis.bot_recommendation,
            "response": analysis.response,
            "community_solutions": solutions_query.data,
        }

    except Exception as e:
        return {"error": str(e)}


def recommend_doctors(analysis: dict, location: str):
    """
    Searches Supabase for doctors based on location and specialization from analysis.
    Returns top 3 doctors sorted by rating.
    """
    try:
        specialization = analysis.get("required_specialization")

        query = (
            supabase.table("doctors")
            .select("name, location, specialization, rating")
            .eq("location", location)
            .ilike("specialization", f"%{specialization}%")
            .order("rating", desc=True)
            .limit(3)
            .execute()
        )

        return query.data

    except Exception as e:
        print(f"Error recommending doctors: {e}")
        return []


def json_response(analysis: dict, doctors: list):
    """
    Formats the analysis and doctors into the final JSON structure requested by the user.
    """
    return {
        "main_problem": analysis.get("main_problem"),
        "cause_of_problem": analysis.get("cause_of_problem"),
        "preventive_measures": analysis.get("preventive_measures"),
        "bot_recommendation": analysis.get("bot_recommendation"),
        "response": analysis.get("response"),
        "community_solution": [
            sol.get("solution")
            for sol in analysis.get("community_solutions", [])
            if sol.get("solution")
        ],
        "call_to_action": {"recommended_doctors": doctors},
    }
