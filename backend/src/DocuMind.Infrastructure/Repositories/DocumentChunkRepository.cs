namespace DocuMind.Infrastructure.Repositories;

using DocuMind.Core.Entities;
using DocuMind.Core.Interfaces.Repositories;
using DocuMind.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

public class DocumentChunkRepository : IDocumentChunkRepository
{
    private readonly AppDbContext _db;

    public DocumentChunkRepository(AppDbContext db) => _db = db;

    /// <summary>Bulk-inserts all chunks in a single SaveChanges call.</summary>
    public async Task CreateManyAsync(List<DocumentChunk> chunks)
    {
        var now = DateTime.UtcNow;
        foreach (var chunk in chunks)
            chunk.CreatedAt = now;

        await _db.DocumentChunks.AddRangeAsync(chunks);
        await _db.SaveChangesAsync();
    }

    /// <summary>Returns all chunks for a document ordered by ChunkIndex ascending.</summary>
    public Task<List<DocumentChunk>> GetByDocumentIdAsync(int documentId)
        => _db.DocumentChunks
              .Where(c => c.DocumentId == documentId)
              .OrderBy(c => c.ChunkIndex)
              .ToListAsync();

    /// <summary>Vector similarity search — implemented in Day 4.</summary>
    public Task<List<DocumentChunk>> SearchSimilarAsync(float[] queryEmbedding, int topK)
        => throw new NotImplementedException("Embedding search is implemented in Day 4.");
}
