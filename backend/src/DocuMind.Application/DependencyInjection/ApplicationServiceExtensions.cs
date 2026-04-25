namespace DocuMind.Application.DependencyInjection;

using DocuMind.Application.Services;
using Microsoft.Extensions.DependencyInjection;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<TextChunkingService>();
        services.AddScoped<IDocumentService, DocumentService>();
        return services;
    }
}
