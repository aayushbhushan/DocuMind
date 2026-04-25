# DocuMind

> AI-powered document intelligence platform

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend API | .NET 10 Web API (Clean Architecture) |
| Database | PostgreSQL + pgvector |
| ORM | Entity Framework Core 10 |
| AI (dev) | Ollama (llama3 + nomic-embed-text) |
| AI (prod) | OpenAI (gpt-4o-mini + text-embedding-3-small) |
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| PDF Parsing | PdfPig |

## Project Structure

```
documind/
├── backend/
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
# Swagger UI: https://localhost:5001/swagger
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
