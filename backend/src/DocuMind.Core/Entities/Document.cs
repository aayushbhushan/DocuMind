namespace DocuMind.Core.Entities;

public class Document
{
    /// <summary>Auto-incremented primary key.</summary>
    public int Id { get; set; }

    /// <summary>Original file name as uploaded by the user (e.g. "report.pdf").</summary>
    public string FileName { get; set; } = string.Empty;

    /// <summary>File extension / type (e.g. "pdf", "txt").</summary>
    public string FileType { get; set; } = string.Empty;

    /// <summary>Full plain text extracted from the document.</summary>
    public string RawText { get; set; } = string.Empty;

    /// <summary>Size of the original uploaded file in bytes.</summary>
    public long FileSize { get; set; }

    /// <summary>UTC timestamp when the document was first uploaded.</summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>UTC timestamp of the last modification (auto-updated on save).</summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>Text chunks derived from this document, each with an AI embedding.</summary>
    public ICollection<DocumentChunk> Chunks { get; set; } = new List<DocumentChunk>();
}
