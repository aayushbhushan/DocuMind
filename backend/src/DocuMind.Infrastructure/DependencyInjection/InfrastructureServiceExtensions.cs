namespace DocuMind.Infrastructure.DependencyInjection;

using DocuMind.Core.Interfaces.Repositories;
using DocuMind.Core.Interfaces.Services;
using DocuMind.Infrastructure.Data;
using DocuMind.Infrastructure.Repositories;
using DocuMind.Infrastructure.Services.AI;
using DocuMind.Infrastructure.Services.FileProcessing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

public static class InfrastructureServiceExtensions
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration config)
    {
        // ── Database ──────────────────────────────────────────────────────────
        services.AddDbContext<AppDbContext>(opts =>
            opts.UseNpgsql(
                config.GetConnectionString("DefaultConnection"),
                npgsql => npgsql.UseVector()
            ));

        // ── Repositories ──────────────────────────────────────────────────────
        services.AddScoped<IDocumentRepository, DocumentRepository>();
        services.AddScoped<IDocumentChunkRepository, DocumentChunkRepository>();

        // ── File processing ───────────────────────────────────────────────────
        services.AddScoped<IFileProcessingService, PdfProcessingService>();

        // ── AI service (provider selected via AI:Provider config) ─────────────
        var provider = config["AI:Provider"] ?? "ollama";
        if (provider.Equals("openai", StringComparison.OrdinalIgnoreCase))
            services.AddHttpClient<IAIService, OpenAIService>(c => c.Timeout = TimeSpan.FromSeconds(60));
        else if (provider.Equals("gemini", StringComparison.OrdinalIgnoreCase))
            services.AddHttpClient<IAIService, GeminiService>(c => c.Timeout = TimeSpan.FromSeconds(60));
        else
            services.AddHttpClient<IAIService, OllamaService>(c => c.Timeout = TimeSpan.FromMinutes(5));

        return services;
    }
}
