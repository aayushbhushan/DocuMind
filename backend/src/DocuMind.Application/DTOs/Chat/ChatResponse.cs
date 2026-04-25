// Response model containing the AI answer and source chunk references
namespace DocuMind.Application.DTOs.Chat;

public class ChatResponse
{
    public string Answer { get; set; } = string.Empty;
    public IEnumerable<string> SourceChunks { get; set; } = new List<string>();
}
