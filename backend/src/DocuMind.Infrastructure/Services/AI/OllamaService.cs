namespace DocuMind.Infrastructure.Services.AI;

using System.Net.Http.Json;
using System.Text.Json;
using DocuMind.Core.Interfaces.Services;
using Microsoft.Extensions.Configuration;

public class OllamaService : IAIService
{
    private readonly HttpClient _http;
    private readonly string _embeddingModel;
    private readonly string _chatModel;

    public OllamaService(HttpClient http, IConfiguration config)
    {
        _http = http;
        _http.BaseAddress = new Uri(config["AI:OllamaBaseUrl"] ?? "http://localhost:11434");
        _embeddingModel = config["AI:EmbeddingModel"] ?? "nomic-embed-text";
        _chatModel = config["AI:ChatModel"] ?? "llama3";
    }

    public async Task<float[]> GenerateEmbeddingAsync(string text)
    {
        var response = await _http.PostAsJsonAsync("/api/embeddings", new
        {
            model = _embeddingModel,
            prompt = text
        });

        response.EnsureSuccessStatusCode();

        using var doc = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync());
        return doc.RootElement
            .GetProperty("embedding")
            .EnumerateArray()
            .Select(e => e.GetSingle())
            .ToArray();
    }

    public async Task<string> GenerateChatResponseAsync(string systemPrompt, string userPrompt)
    {
        var response = await _http.PostAsJsonAsync("/api/generate", new
        {
            model = _chatModel,
            prompt = $"{systemPrompt}\n\n{userPrompt}",
            stream = false
        });

        response.EnsureSuccessStatusCode();

        using var doc = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync());
        return doc.RootElement.GetProperty("response").GetString()
            ?? throw new InvalidOperationException("Empty response from Ollama.");
    }

    public Task<string> GenerateSummaryAsync(string text)
        => GenerateChatResponseAsync(
            "You are a document summarization assistant. Provide a concise, well-structured summary.",
            $"Please summarize the following document:\n\n{text}");
}
