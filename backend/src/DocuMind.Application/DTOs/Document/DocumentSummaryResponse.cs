namespace DocuMind.Application.DTOs.Document;

public class DocumentSummaryResponse
{
    /// <summary>Database primary key.</summary>
    public int Id { get; set; }

    /// <summary>Original file name as uploaded (e.g. "report.pdf").</summary>
    public string FileName { get; set; } = string.Empty;

    /// <summary>File extension without the dot (e.g. "pdf", "txt").</summary>
    public string FileType { get; set; } = string.Empty;

    /// <summary>File size in bytes.</summary>
    public long FileSize { get; set; }

    /// <summary>UTC timestamp when the document was uploaded.</summary>
    public DateTime CreatedAt { get; set; }
}
