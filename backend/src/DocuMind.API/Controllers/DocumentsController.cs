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

    /// <summary>POST /api/documents/upload — Extracts text, chunks, and stores the document.</summary>
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
        catch (ArgumentException ex) { return BadRequest(ex.Message); }
        catch (InvalidOperationException ex) { return BadRequest(ex.Message); }
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

    /// <summary>POST /api/documents/generate-embeddings/{id} — Generates and stores embeddings for all chunks.</summary>
    [HttpPost("generate-embeddings/{id:int}")]
    public async Task<IActionResult> GenerateEmbeddings(int id)
    {
        try
        {
            var count = await _documentService.GenerateEmbeddingsAsync(id);
            return Ok(new { documentId = id, embeddingsGenerated = count });
        }
        catch (InvalidOperationException ex) { return BadRequest(ex.Message); }
    }

    /// <summary>GET /api/documents/{id}/file — Returns the raw file bytes for PDF or TXT documents.</summary>
    [HttpGet("{id:int}/file")]
    public async Task<IActionResult> GetFile(int id)
    {
        var doc = await _documentService.GetDocumentAsync(id);
        if (doc is null) return NotFound();
        if (doc.FileBytes is null || doc.FileBytes.Length == 0) return NotFound("File bytes not available for this document.");
        var contentType = doc.FileType == "pdf" ? "application/pdf" : "text/plain";
        return File(doc.FileBytes, contentType, doc.FileName);
    }

    /// <summary>DELETE /api/documents/{id} — Permanently deletes a document and its chunks.</summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _documentService.DeleteDocumentAsync(id);
            return NoContent();
        }
        catch (InvalidOperationException ex) { return NotFound(ex.Message); }
    }
}
