namespace DocuMind.Core.Entities;

public class DocumentChunk
{
    /// <summary>Auto-incremented primary key.</summary>
    public int Id { get; set; }

    /// <summary>Foreign key referencing the parent Document.</summary>
    public int DocumentId { get; set; }

    /// <summary>Zero-based position of this chunk within the document (0, 1, 2, ...).</summary>
    public int ChunkIndex { get; set; }

    /// <summary>The actual text content of this chunk (~500 words).</summary>
    public string Content { get; set; } = string.Empty;

    /// <summary>
    /// AI-generated embedding vector for semantic similarity search.
    /// Stored as float[] in the domain; mapped to pgvector in Infrastructure.
    /// 1536 dimensions for OpenAI, 768 for Ollama nomic-embed-text.
    /// </summary>
    public float[]? Embedding { get; set; }

    /// <summary>UTC timestamp when this chunk was created.</summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>Navigation property back to the parent document.</summary>
    public Document Document { get; set; } = null!;
}
