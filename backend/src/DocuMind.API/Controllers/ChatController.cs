// REST endpoint for document-grounded chat (RAG question-answering)
namespace DocuMind.API.Controllers;

using Microsoft.AspNetCore.Mvc;
using DocuMind.Application.DTOs.Chat;
using DocuMind.Application.Services;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly ChatService _chatService;

    public ChatController(ChatService chatService) => _chatService = chatService;

    [HttpPost]
    public async Task<IActionResult> Ask([FromBody] ChatRequest request, CancellationToken ct)
        => Ok(await _chatService.AskAsync(request, ct));
}
