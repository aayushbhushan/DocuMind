namespace DocuMind.Core.Constants;

public static class AppConstants
{
    /// <summary>Number of words per text chunk sent to the embedding model.</summary>
    public const int DefaultChunkSize = 500;

    /// <summary>Number of words shared between consecutive chunks for context continuity.</summary>
    public const int DefaultChunkOverlap = 100;

    /// <summary>Number of similar chunks to retrieve during semantic search.</summary>
    public const int DefaultTopKResults = 5;

    /// <summary>Maximum allowed upload size (10 MB).</summary>
    public const long MaxFileSizeBytes = 10 * 1024 * 1024;

    /// <summary>File extensions accepted by the upload endpoint.</summary>
    public static readonly string[] SupportedFileTypes = { ".pdf", ".txt" };
}
