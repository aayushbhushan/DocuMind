// REST endpoint for generating an AI summary of a specific document
namespace DocuMind.API.Controllers;

using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/documents/{documentId:guid}/summary")]
public class SummaryController : ControllerBase
{
    [HttpGet]
    public Task<IActionResult> GetSummary(Guid documentId, CancellationToken ct)
        => throw new NotImplementedException();
}
