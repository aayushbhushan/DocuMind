namespace DocuMind.Core.Interfaces.Repositories;

using DocuMind.Core.Entities;

public interface IDocumentChunkRepository
{
    /// <summary>Bulk-inserts all chunks for a document in a single SaveChanges call.</summary>
    Task CreateManyAsync(List<DocumentChunk> chunks);

    /// <summary>Returns all chunks for a document ordered by ChunkIndex ascending.</summary>
    Task<List<DocumentChunk>> GetByDocumentIdAsync(int documentId);

    /// <summary>
    /// Returns the topK chunks most similar to queryEmbedding using pgvector cosine distance.
    /// Only considers chunks that already have an embedding stored.
    /// </summary>
    Task<List<DocumentChunk>> GetSimilarChunksAsync(int documentId, float[] queryEmbedding, int topK = 5);

    /// <summary>Stores the computed embedding on an existing chunk.</summary>
    Task UpdateEmbeddingAsync(int chunkId, float[] embedding);
}
