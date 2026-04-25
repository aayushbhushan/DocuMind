namespace DocuMind.API.Controllers;

using DocuMind.Application.DTOs.Chat;
using DocuMind.Application.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IChatService _chatService;

    public ChatController(IChatService chatService) => _chatService = chatService;

    /// <summary>POST /api/chat/ask — RAG question-answering against a specific document.</summary>
    [HttpPost("ask")]
    public async Task<IActionResult> Ask([FromBody] ChatRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Question))
            return BadRequest("Question is required.");

        try
        {
            var response = await _chatService.AskQuestionAsync(request);
            return Ok(response);
        }
        catch (InvalidOperationException ex) { return BadRequest(ex.Message); }
    }

    /// <summary>POST /api/chat/summarize/{documentId} — Generates an AI summary of the document.</summary>
    [HttpPost("summarize/{documentId:int}")]
    public async Task<IActionResult> Summarize(int documentId)
    {
        try
        {
            var summary = await _chatService.SummarizeDocumentAsync(documentId);
            return Ok(new { documentId, summary });
        }
        catch (InvalidOperationException ex) { return BadRequest(ex.Message); }
    }
}
