namespace DocuMind.Infrastructure.Services.FileProcessing;

using DocuMind.Core.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using UglyToad.PdfPig;

public class PdfProcessingService : IFileProcessingService
{
    /// <summary>
    /// Extracts plain text from a PDF or TXT file.
    /// Throws <see cref="ArgumentException"/> for unsupported extensions.
    /// Throws <see cref="InvalidOperationException"/> if the file yields no text.
    /// </summary>
    public async Task<string> ExtractTextAsync(IFormFile file)
    {
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        var text = extension switch
        {
            ".txt" => await ExtractFromTxtAsync(file),
            ".pdf" => await ExtractFromPdfAsync(file),
            _ => throw new ArgumentException(
                $"Unsupported file type '{extension}'. Only PDF and TXT are supported.")
        };

        text = text.Trim();

        if (string.IsNullOrWhiteSpace(text))
            throw new InvalidOperationException(
                "No text could be extracted from the document.");

        return text;
    }

    private static async Task<string> ExtractFromTxtAsync(IFormFile file)
    {
        using var reader = new StreamReader(file.OpenReadStream());
        return await reader.ReadToEndAsync();
    }

    private static Task<string> ExtractFromPdfAsync(IFormFile file)
    {
        using var stream = file.OpenReadStream();
        using var pdf = PdfDocument.Open(stream);

        var pages = pdf.GetPages()
            .Select(page => string.Join(" ", page.GetWords().Select(w => w.Text)));

        return Task.FromResult(string.Join("\n", pages));
    }
}
