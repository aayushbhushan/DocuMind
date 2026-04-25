// IAIService implementation using the OpenAI API for production deployments
namespace DocuMind.Infrastructure.Services.AI;

using DocuMind.Core.Interfaces.Services;

public class OpenAIService : IAIService
{
    public Task<float[]> GenerateEmbeddingAsync(string text, CancellationToken ct = default)
        => throw new NotImplementedException();

    public Task<string> ChatAsync(string systemPrompt, string userMessage, CancellationToken ct = default)
        => throw new NotImplementedException();
}
