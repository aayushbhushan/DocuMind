using DocuMind.API.Middleware;
using DocuMind.Application.DependencyInjection;
using DocuMind.Infrastructure.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// ── Controllers & API Explorer ────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// ── Swagger ───────────────────────────────────────────────────────────────────
builder.Services.AddSwaggerGen();

// ── CORS ──────────────────────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ── Infrastructure layer ──────────────────────────────────────────────────────
builder.Services.AddInfrastructure(builder.Configuration);

// ── Application layer ─────────────────────────────────────────────────────────
builder.Services.AddApplication();

var app = builder.Build();

// ── Global exception handler ──────────────────────────────────────────────────
app.UseMiddleware<GlobalExceptionMiddleware>();

// ── Swagger enabled for ALL environments (needed for production demo) ─────────
app.UseSwagger();
app.UseSwaggerUI();

// ── HTTPS redirect removed — Render handles HTTPS termination itself ──────────

// ── CORS must come before MapControllers ──────────────────────────────────────
app.UseCors("AllowFrontend");

app.MapControllers();

app.MapGet("/health", () => Results.Ok(new {
    status = "healthy",
    timestamp = DateTime.UtcNow
}));

app.Run();