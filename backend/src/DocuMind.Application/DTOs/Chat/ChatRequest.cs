// Request model for asking a question against one or more documents
namespace DocuMind.Application.DTOs.Chat;

public class ChatRequest
{
    public int DocumentId { get; set; }
    public string Question { get; set; } = string.Empty;
}
