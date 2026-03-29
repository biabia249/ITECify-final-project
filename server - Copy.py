from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import httpx
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[Message]
    system: str = "Ești un asistent AI util și prietenos. Răspunde în limba în care ți se vorbește."

@app.post("/api/chat")
async def chat(req: ChatRequest):
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY nu este setat pe server")

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [{"role": "system", "content": req.system}] + [m.model_dump() for m in req.messages],
                "max_tokens": 1024,
            }
        )

    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail=resp.json().get("error", {}).get("message", "Eroare Groq"))

    return {"reply": resp.json()["choices"][0]["message"]["content"]}

app.mount("/", StaticFiles(directory="static", html=True), name="static")