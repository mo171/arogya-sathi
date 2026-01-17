from typing import Any, Type
from pydantic import BaseModel, Field
from lib.openai_client import client


def get_structured_analysis(text: str, system_prompt: str, schema: Type[BaseModel]) -> Any:
    """
    Generic function to call OpenAI with structured output using a shared client.
    """
    try:
        response = client.beta.chat.completions.parse(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": text}
            ],
            response_format=schema,
        )
        return response.choices[0].message.parsed
    except Exception as e:
        print(f"Error in structured LLM analysis: {e}")
        raise e
