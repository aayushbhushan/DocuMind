namespace DocuMind.Infrastructure.Repositories;

using DocuMind.Core.Entities;
using DocuMind.Core.Interfaces.Repositories;
using DocuMind.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Pgvector;

public class DocumentChunkRepository : IDocumentChunkRepository
{
    private readonly AppDbContext _db;

    public DocumentChunkRepository(AppDbContext db) => _db = db;

    public async Task CreateManyAsync(List<DocumentChunk> chunks)
    {
        var now = DateTime.UtcNow;
        foreach (var chunk in chunks)
            chunk.CreatedAt = now;

        await _db.DocumentChunks.AddRangeAsync(chunks);
        await _db.SaveChangesAsync();
    }

    public Task<List<DocumentChunk>> GetByDocumentIdAsync(int documentId)
        => _db.DocumentChunks
              .Where(c => c.DocumentId == documentId)
              .OrderBy(c => c.ChunkIndex)
              .ToListAsync();

    public Task<List<DocumentChunk>> GetSimilarChunksAsync(int documentId, float[] queryEmbedding, int topK = 5)
    {
        var queryVector = new Vector(queryEmbedding);
        return _db.DocumentChunks
            .FromSqlInterpolated($"""
                SELECT * FROM document_chunks
                WHERE "DocumentId" = {documentId}
                  AND "Embedding" IS NOT NULL
                ORDER BY "Embedding" <=> {queryVector}
                LIMIT {topK}
                """)
            .ToListAsync();
    }

    public async Task UpdateEmbeddingAsync(int chunkId, float[] embedding)
    {
        var chunk = await _db.DocumentChunks.FindAsync(chunkId)
            ?? throw new InvalidOperationException($"Chunk {chunkId} not found.");
        chunk.Embedding = embedding;
        await _db.SaveChangesAsync();
    }
}
