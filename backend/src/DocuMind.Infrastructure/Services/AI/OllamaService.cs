// IAIService implementation using a local Ollama instance for development
namespace DocuMind.Infrastructure.Services.AI;

using DocuMind.Core.Interfaces.Services;

public class OllamaService : IAIService
{
    public Task<float[]> GenerateEmbeddingAsync(string text, CancellationToken ct = default)
        => throw new NotImplementedException();

    public Task<string> ChatAsync(string systemPrompt, string userMessage, CancellationToken ct = default)
        => throw new NotImplementedException();
}
