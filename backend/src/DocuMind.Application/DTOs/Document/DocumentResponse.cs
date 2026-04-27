namespace DocuMind.Application.DTOs.Document;

public class DocumentResponse
{
    /// <summary>Database primary key.</summary>
    public int Id { get; set; }

    /// <summary>Original file name as uploaded (e.g. "report.pdf").</summary>
    public string FileName { get; set; } = string.Empty;

    /// <summary>File extension without the dot (e.g. "pdf", "txt").</summary>
    public string FileType { get; set; } = string.Empty;

    /// <summary>File size in bytes.</summary>
    public long FileSize { get; set; }

    /// <summary>Number of text chunks generated from this document.</summary>
    public int ChunkCount { get; set; }

    /// <summary>UTC timestamp when the document was uploaded.</summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>Full extracted text — returned by GET /api/documents/{id} for the viewer.</summary>
    public string RawText { get; set; } = string.Empty;

    /// <summary>Raw file bytes — returned by GET /api/documents/{id} for the file endpoint.</summary>
    public byte[]? FileBytes { get; set; }
}
