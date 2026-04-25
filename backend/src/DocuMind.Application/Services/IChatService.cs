namespace DocuMind.Application.Services;

using DocuMind.Application.DTOs.Chat;

public interface IChatService
{
    Task<ChatResponse> AskQuestionAsync(ChatRequest request);
    Task<string> SummarizeDocumentAsync(int documentId);
}
