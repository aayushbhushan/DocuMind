namespace DocuMind.Core.Interfaces.Repositories;

using DocuMind.Core.Entities;

public interface IDocumentChunkRepository
{
    /// <summary>Bulk-inserts all chunks for a document in a single SaveChanges call.</summary>
    Task CreateManyAsync(List<DocumentChunk> chunks);

    /// <summary>Returns all chunks for a document ordered by ChunkIndex ascending.</summary>
    Task<List<DocumentChunk>> GetByDocumentIdAsync(int documentId);

    /// <summary>Finds the topK most similar chunks to the given query embedding (implemented in Day 4).</summary>
    Task<List<DocumentChunk>> SearchSimilarAsync(float[] queryEmbedding, int topK);
}
