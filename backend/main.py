from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import cases, ai, analytics
from dotenv import load_dotenv

load_dotenv()  # This reads your .env file

app = FastAPI(title='CourtMate AI API')

# Allow your React app to talk to this backend
app.add_middleware(
  CORSMiddleware,
  allow_origins=['http://localhost:5173'],
  allow_methods=['*'],
  allow_headers=['*'],
)

# Register route groups
app.include_router(cases.router, prefix='/cases', tags=['Cases'])
app.include_router(ai.router, prefix='/ai', tags=['AI'])
app.include_router(analytics.router, prefix='/analytics', tags=['Analytics'])

@app.get('/')
def root():
    return {'message': 'CourtMate API is running!'}
