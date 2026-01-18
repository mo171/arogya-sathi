from pydantic import BaseModel, Field


class HealthAnalysisSchema(BaseModel):
    main_problem: str = Field(
        description="The primary health issue identified from the text"
    )
    cause_of_problem: str = Field(
        description="The likely cause or trigger for the health issue"
    )
    preventive_measures: str = Field(
        description="Steps the user can take to prevent this issue in the future"
    )
    required_specialization: str = Field(
        description="The medical specialization required (e.g., Dermatologist, Cardiologist, ENT, General Physician)"
    )
    bot_recommendation: str = Field(
        description="Medical suggestion: home remedies recommended or not-recommended"
    )
    response: str = Field(
        description="Medical suggestion: whether to seek a doctor or if it's manageable at home"
    )
