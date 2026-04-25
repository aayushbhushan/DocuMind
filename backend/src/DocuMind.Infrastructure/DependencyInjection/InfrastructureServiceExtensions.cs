namespace DocuMind.Infrastructure.DependencyInjection;

using DocuMind.Core.Interfaces.Repositories;
using DocuMind.Core.Interfaces.Services;
using DocuMind.Infrastructure.Data;
using DocuMind.Infrastructure.Repositories;
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

        return services;
    }
}
