// Response model containing the AI answer and source chunk references
namespace DocuMind.Application.DTOs.Chat;

public class ChatResponse
{
    public int DocumentId { get; set; }
    public string Answer { get; set; } = string.Empty;
    public List<string> SourceChunks { get; set; } = [];
}
