using DocuMind.API.Middleware;
using DocuMind.Application.DependencyInjection;
using DocuMind.Infrastructure.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// ── Controllers & API Explorer ────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// ── Swagger ───────────────────────────────────────────────────────────────────
builder.Services.AddSwaggerGen();

// ── Infrastructure layer ──────────────────────────────────────────────────────
// Registers: AppDbContext (PostgreSQL + pgvector), repositories, IFileProcessingService
builder.Services.AddInfrastructure(builder.Configuration);

// ── Application layer ─────────────────────────────────────────────────────────
// Registers: TextChunkingService, IDocumentService → DocumentService
builder.Services.AddApplication();

var app = builder.Build();

// ── Global exception handler ──────────────────────────────────────────────────
app.UseMiddleware<GlobalExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();
