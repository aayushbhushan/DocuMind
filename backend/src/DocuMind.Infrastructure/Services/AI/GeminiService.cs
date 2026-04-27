namespace DocuMind.Infrastructure.Services.AI;

using System.Net.Http.Json;
using System.Text.Json;
using DocuMind.Core.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

public class GeminiService : IAIService
{
    private readonly HttpClient _http;
    private readonly string _apiKey;
    private readonly string _chatModel;
    private readonly string _embeddingModel;
    private readonly ILogger<GeminiService> _logger;

    private const string BaseUrl = "https://generativelanguage.googleapis.com/v1beta/models";

    public GeminiService(HttpClient http, IConfiguration config, ILogger<GeminiService> logger)
    {
        _http = http;
        _logger = logger;
        _apiKey = config["AI:GeminiApiKey"]
            ?? throw new InvalidOperationException("AI:GeminiApiKey is not configured.");
        _chatModel = config["AI:ChatModel"] ?? "gemini-2.0-flash";
        _embeddingModel = config["AI:EmbeddingModel"] ?? "text-embedding-004";
    }

    /// <summary>Generates a vector embedding for the given text using Gemini text-embedding-004.</summary>
    public async Task<float[]> GenerateEmbeddingAsync(string text)
    {
        var url = $"{BaseUrl}/{_embeddingModel}:embedContent?key={_apiKey}";
        var body = new
        {
            content = new
            {
                parts = new[] { new { text } }
            }
        };

        try
        {
            var response = await _http.PostAsJsonAsync(url, body);
            response.EnsureSuccessStatusCode();

            using var doc = await JsonDocument.ParseAsync(
                await response.Content.ReadAsStreamAsync());
            return doc.RootElement
                .GetProperty("embedding")
                .GetProperty("values")
                .EnumerateArray()
                .Select(e => e.GetSingle())
                .ToArray();
        }
        catch (Exception ex) when (ex is not InvalidOperationException)
        {
            _logger.LogError(ex, "Gemini embedding request failed.");
            throw new InvalidOperationException("Failed to generate embedding via Gemini.", ex);
        }
    }

    /// <summary>Generates a chat response from Gemini using separate system and user prompts.</summary>
    public async Task<string> GenerateChatResponseAsync(string systemPrompt, string userPrompt)
    {
        var url = $"{BaseUrl}/{_chatModel}:generateContent?key={_apiKey}";
        var body = new
        {
            system_instruction = new
            {
                parts = new[] { new { text = systemPrompt } }
            },
            contents = new[]
            {
                new
                {
                    parts = new[] { new { text = userPrompt } }
                }
            }
        };

        try
        {
            var response = await _http.PostAsJsonAsync(url, body);
            response.EnsureSuccessStatusCode();

            using var doc = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync());
            return doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString()
                ?? throw new InvalidOperationException("Empty response from Gemini.");
        }
        catch (Exception ex) when (ex is not InvalidOperationException)
        {
            _logger.LogError(ex, "Gemini chat request failed.");
            throw new InvalidOperationException("Failed to get chat response from Gemini.", ex);
        }
    }

    /// <summary>Generates a structured summary of the provided document text.</summary>
    public Task<string> GenerateSummaryAsync(string text)
        => GenerateChatResponseAsync(
            "You are a document summarization assistant. Provide a clear concise summary covering main topics, key findings, and important details.",
            $"Please summarize the following document:\n\n{text}");
}
