from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
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

class ChatMessage(BaseModel):
    role: str  # "user", "assistant", or "system"
    content: str

class ReflectRequest(BaseModel):
    message: str
    context: Optional[List[ChatMessage]] = []  # Previous messages for context
    global_context: Optional[str] = ""  # Global context string
    user_id: Optional[str] = None  # User ID for fetching global context

class ReflectResponse(BaseModel):
    response: str

@app.post("/api/v1/reflect", response_model=ReflectResponse)
async def get_reflection(request: ReflectRequest):
    try:
        if not request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")

        # Convert context to format expected by llama_handler
        context_messages = []
        if request.context:
            for msg in request.context:
                context_messages.append({
                    "role": msg.role,
                    "content": msg.content
                })

        response = reflect(request.message, context_messages, request.global_context or "")
        return ReflectResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating reflection: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
