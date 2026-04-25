namespace DocuMind.Core.Interfaces.Services;

using Microsoft.AspNetCore.Http;

public interface IFileProcessingService
{
    /// <summary>
    /// Extracts plain text from a PDF or TXT file.
    /// Throws <see cref="ArgumentException"/> for unsupported file types.
    /// Throws <see cref="InvalidOperationException"/> if no text can be extracted.
    /// </summary>
    Task<string> ExtractTextAsync(IFormFile file);
}
