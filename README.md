# DocuMind

> AI-powered document intelligence platform

## Live Demo
- Frontend: [Vercel URL - coming soon]
- Backend API: [Render URL]/swagger

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend API | .NET 10 Web API (Clean Architecture) |
| Database | PostgreSQL + pgvector |
| ORM | Entity Framework Core 10 |
| AI (dev) | Ollama (llama3 + nomic-embed-text) |
| AI (prod) | Google Gemini (gemini-2.0-flash + text-embedding-004) |
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| PDF Parsing | PdfPig |

## Project Structure

```
documind/
├── backend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── DocuMind.API           # Controllers, middleware, Program.cs
│   │   ├── DocuMind.Core          # Entities, interfaces (no dependencies)
│   │   ├── DocuMind.Application   # Services, DTOs, validators, mappings
│   │   └── DocuMind.Infrastructure # EF Core, repositories, AI & PDF services
│   └── tests/
│       └── DocuMind.Tests
└── frontend/                      # Next.js App Router application
```

## Getting Started

### Prerequisites
- .NET 10 SDK
- Node.js 20+
- PostgreSQL 15+ with pgvector extension
- Ollama (for local AI development)

### Backend

```bash
cd backend
dotnet restore
dotnet build

# Run API
cd src/DocuMind.API
dotnet run
# Swagger UI: http://localhost:5242/swagger
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# App: http://localhost:3000
```

### Database

```bash
# After setting up PostgreSQL and updating appsettings.Development.json:
cd backend
dotnet ef migrations add InitialCreate --project src/DocuMind.Infrastructure --startup-project src/DocuMind.API
dotnet ef database update --project src/DocuMind.Infrastructure --startup-project src/DocuMind.API
```

## Deployment Stack

| Layer | Platform | Notes |
|---|---|---|
| Frontend | Vercel | Auto-deploys from GitHub main |
| Backend | Render | Docker container, .NET 10 |
| Database | Neon PostgreSQL | pgvector enabled |
| AI | Google Gemini | gemini-2.0-flash + text-embedding-004 |

## Environment Variables

### Backend (set in Render dashboard)
- `ASPNETCORE_ENVIRONMENT=Production`
- `ASPNETCORE_URLS=http://+:10000`
- `ConnectionStrings__DefaultConnection=your_neon_connection_string`
- `AI__Provider=gemini`
- `AI__GeminiApiKey=your_gemini_api_key`
- `AI__ChatModel=gemini-2.0-flash`
- `AI__EmbeddingModel=text-embedding-004`

### Frontend (set in Vercel dashboard)
- `NEXT_PUBLIC_API_URL=https://your-render-url.onrender.com`

## Production Migration (Neon)

Run from the `backend/` folder, replacing the placeholder values:

```bash
dotnet ef database update \
  --project src/DocuMind.Infrastructure \
  --startup-project src/DocuMind.API \
  --connection "Host=NEON_HOST;Database=neondb;Username=neondb_owner;Password=NEON_PASSWORD;SSL Mode=Require;Trust Server Certificate=true"
```
