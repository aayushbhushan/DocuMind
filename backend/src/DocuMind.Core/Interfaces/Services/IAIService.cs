// Contract for AI operations: embedding generation and chat completion
namespace DocuMind.Core.Interfaces.Services;

public interface IAIService
{
    Task<float[]> GenerateEmbeddingAsync(string text, CancellationToken ct = default);
    Task<string> ChatAsync(string systemPrompt, string userMessage, CancellationToken ct = default);
}
