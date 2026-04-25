namespace DocuMind.Application.Services;

using DocuMind.Application.DTOs.Chat;
using DocuMind.Core.Interfaces.Repositories;
using DocuMind.Core.Interfaces.Services;

public class ChatService : IChatService
{
    private readonly IDocumentChunkRepository _chunkRepository;
    private readonly IAIService _aiService;

    public ChatService(IDocumentChunkRepository chunkRepository, IAIService aiService)
    {
        _chunkRepository = chunkRepository;
        _aiService = aiService;
    }

    public async Task<ChatResponse> AskQuestionAsync(ChatRequest request)
    {
        var questionEmbedding = await _aiService.GenerateEmbeddingAsync(request.Question);

        var chunks = await _chunkRepository.GetSimilarChunksAsync(request.DocumentId, questionEmbedding);

        if (chunks.Count == 0)
            return new ChatResponse
            {
                DocumentId = request.DocumentId,
                Answer = "No relevant content found. Please generate embeddings for this document first.",
                SourceChunks = []
            };

        var context = string.Join("\n\n---\n\n", chunks.Select(c => c.Content));
        const string systemPrompt =
            "You are a helpful AI assistant. Answer the user's question based only on the provided context. " +
            "If the answer cannot be found in the context, say you don't know.";
        var userPrompt = $"Context:\n{context}\n\nQuestion: {request.Question}";

        var answer = await _aiService.GenerateChatResponseAsync(systemPrompt, userPrompt);

        return new ChatResponse
        {
            DocumentId = request.DocumentId,
            Answer = answer,
            SourceChunks = chunks.Select(c => c.Content).ToList()
        };
    }

    public async Task<string> SummarizeDocumentAsync(int documentId)
    {
        var chunks = await _chunkRepository.GetByDocumentIdAsync(documentId);

        if (chunks.Count == 0)
            throw new InvalidOperationException($"No chunks found for document {documentId}.");

        var fullText = string.Join("\n\n", chunks.Select(c => c.Content));
        return await _aiService.GenerateSummaryAsync(fullText);
    }
}
