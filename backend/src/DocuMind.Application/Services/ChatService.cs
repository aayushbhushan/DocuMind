// Handles RAG-based chat: embeds question, retrieves relevant chunks, calls AI for answer
namespace DocuMind.Application.Services;

using DocuMind.Application.DTOs.Chat;
using DocuMind.Core.Interfaces.Repositories;
using DocuMind.Core.Interfaces.Services;

public class ChatService
{
    private readonly IDocumentChunkRepository _chunkRepository;
    private readonly IAIService _aiService;

    public ChatService(IDocumentChunkRepository chunkRepository, IAIService aiService)
    {
        _chunkRepository = chunkRepository;
        _aiService = aiService;
    }

    public Task<ChatResponse> AskAsync(ChatRequest request, CancellationToken ct = default)
        => throw new NotImplementedException();
}
