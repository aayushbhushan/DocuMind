namespace DocuMind.Application.DTOs.Document;

using Microsoft.AspNetCore.Http;

public class UploadDocumentRequest
{
    /// <summary>The file uploaded by the client (PDF or TXT).</summary>
    public IFormFile File { get; set; } = null!;
}
