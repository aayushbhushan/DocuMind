namespace DocuMind.Application.Services;

using Microsoft.AspNetCore.Http;
using DocuMind.Application.DTOs.Document;

public interface IDocumentService
{
    /// <summary>
    /// Full upload pipeline: extract text → chunk → save document + chunks → return response.
    /// </summary>
    Task<DocumentResponse> UploadDocumentAsync(IFormFile file);

    /// <summary>Returns a document by Id, or null if not found.</summary>
    Task<DocumentResponse?> GetDocumentAsync(int id);

    /// <summary>Returns all documents as lightweight summary objects.</summary>
    Task<List<DocumentSummaryResponse>> GetAllDocumentsAsync();
}
