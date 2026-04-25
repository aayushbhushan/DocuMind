// Request model for asking a question against one or more documents
namespace DocuMind.Application.DTOs.Chat;

public class ChatRequest
{
    public string Question { get; set; } = string.Empty;
    public Guid? DocumentId { get; set; }
}
