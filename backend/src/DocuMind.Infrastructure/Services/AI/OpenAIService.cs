namespace DocuMind.Infrastructure.Services.AI;

using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using DocuMind.Core.Interfaces.Services;
using Microsoft.Extensions.Configuration;

public class OpenAIService : IAIService
{
    private readonly HttpClient _http;
    private readonly string _embeddingModel;
    private readonly string _chatModel;

    public OpenAIService(HttpClient http, IConfiguration config)
    {
        var apiKey = config["AI:OpenAIApiKey"]
            ?? throw new InvalidOperationException("AI:OpenAIApiKey is not configured.");

        _http = http;
        _http.BaseAddress = new Uri("https://api.openai.com");
        _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

        _embeddingModel = config["AI:EmbeddingModel"] ?? "text-embedding-3-small";
        _chatModel = config["AI:ChatModel"] ?? "gpt-4o-mini";
    }

    public async Task<float[]> GenerateEmbeddingAsync(string text)
    {
        var response = await _http.PostAsJsonAsync("/v1/embeddings", new
        {
            model = _embeddingModel,
            input = text
        });

        response.EnsureSuccessStatusCode();

        using var doc = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync());
        return doc.RootElement
            .GetProperty("data")[0]
            .GetProperty("embedding")
            .EnumerateArray()
            .Select(e => e.GetSingle())
            .ToArray();
    }

    public async Task<string> GenerateChatResponseAsync(string systemPrompt, string userPrompt)
    {
        var response = await _http.PostAsJsonAsync("/v1/chat/completions", new
        {
            model = _chatModel,
            messages = new[]
            {
                new { role = "system", content = systemPrompt },
                new { role = "user", content = userPrompt }
            }
        });

        response.EnsureSuccessStatusCode();

        using var doc = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync());
        return doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString()
            ?? throw new InvalidOperationException("Empty response from OpenAI.");
    }

    public Task<string> GenerateSummaryAsync(string text)
        => GenerateChatResponseAsync(
            "You are a document summarization assistant. Provide a concise, well-structured summary.",
            $"Please summarize the following document:\n\n{text}");
}
