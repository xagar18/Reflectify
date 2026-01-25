from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from llama_handler import reflect

app = FastAPI(title="Reflectify Model API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ReflectRequest(BaseModel):
    message: str

class ReflectResponse(BaseModel):
    response: str

@app.post("/api/v1/reflect", response_model=ReflectResponse)
async def get_reflection(request: ReflectRequest):
    try:
        if not request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")

        response = reflect(request.message)
        return ReflectResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating reflection: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
