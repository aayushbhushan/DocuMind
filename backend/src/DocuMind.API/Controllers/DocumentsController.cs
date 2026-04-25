namespace DocuMind.API.Controllers;

using DocuMind.Application.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class DocumentsController : ControllerBase
{
    private readonly IDocumentService _documentService;

    public DocumentsController(IDocumentService documentService)
        => _documentService = documentService;

    /// <summary>
    /// POST /api/documents/upload
    /// Accepts a multipart/form-data file, extracts text, chunks it, and stores it.
    /// </summary>
    [HttpPost("upload")]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file is null || file.Length == 0)
            return BadRequest("File is required and must not be empty.");

        try
        {
            var result = await _documentService.UploadDocumentAsync(file);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while uploading the document: {ex.Message}");
        }
    }

    /// <summary>GET /api/documents — Returns all documents as summary objects.</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _documentService.GetAllDocumentsAsync());

    /// <summary>GET /api/documents/{id} — Returns a single document with chunk count.</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var doc = await _documentService.GetDocumentAsync(id);
        return doc is null ? NotFound() : Ok(doc);
    }
}
