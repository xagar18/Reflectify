from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from llama_handler import reflect

app = FastAPI(title="Reflectify Model API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],  # Frontend URLs
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
    debug_info: Optional[dict] = None

@app.post("/api/v1/reflect", response_model=ReflectResponse)
async def get_reflection(request: ReflectRequest):
    try:
        if not request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")

        # Convert context to format expected by llama_handler
        context_messages = []
        if request.context:
            for msg in request.context:
                if msg.content.strip():  # Only add non-empty messages
                    context_messages.append({
                        "role": msg.role,
                        "content": msg.content
                    })

        # Clean and validate global context
        global_ctx = (request.global_context or "").strip()

        # Debug logging
        print(f"📨 Received request:")
        print(f"   Message: {request.message[:50]}{'...' if len(request.message) > 50 else ''}")
        print(f"   Context messages: {len(context_messages)}")
        print(f"   Global context: {len(global_ctx)} chars")
        if global_ctx:
            print(f"   Global context preview: {global_ctx[:100]}{'...' if len(global_ctx) > 100 else ''}")

        response = reflect(request.message, context_messages, global_ctx)

        return ReflectResponse(
            response=response,
            debug_info={
                "context_messages_count": len(context_messages),
                "global_context_length": len(global_ctx),
                "has_global_context": bool(global_ctx)
            }
        )
    except Exception as e:
        print(f"❌ Error in get_reflection: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating reflection: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
