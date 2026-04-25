namespace DocuMind.Core.Interfaces.Services;

public interface IAIService
{
    /// <summary>Converts text into a float vector for semantic similarity search.</summary>
    Task<float[]> GenerateEmbeddingAsync(string text);

    /// <summary>Sends a system + user prompt to the AI model and returns the text response.</summary>
    Task<string> GenerateChatResponseAsync(string systemPrompt, string userPrompt);

    /// <summary>Generates a concise summary of the provided document text.</summary>
    Task<string> GenerateSummaryAsync(string text);
}
