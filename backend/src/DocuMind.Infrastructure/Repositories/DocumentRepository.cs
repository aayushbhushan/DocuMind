namespace DocuMind.Infrastructure.Repositories;

using DocuMind.Core.Entities;
using DocuMind.Core.Interfaces.Repositories;
using DocuMind.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

public class DocumentRepository : IDocumentRepository
{
    private readonly AppDbContext _db;

    public DocumentRepository(AppDbContext db) => _db = db;

    /// <summary>Persists a new document and returns it with the generated Id.</summary>
    public async Task<Document> CreateAsync(Document document)
    {
        document.CreatedAt = DateTime.UtcNow;
        document.UpdatedAt = DateTime.UtcNow;
        await _db.Documents.AddAsync(document);
        await _db.SaveChangesAsync();
        return document;
    }

    /// <summary>Returns a document by Id including its chunks, or null if not found.</summary>
    public Task<Document?> GetByIdAsync(int id)
        => _db.Documents
              .Include(d => d.Chunks)
              .FirstOrDefaultAsync(d => d.Id == id);

    /// <summary>Returns all documents ordered by CreatedAt descending (no chunks loaded).</summary>
    public Task<List<Document>> GetAllAsync()
        => _db.Documents
              .OrderByDescending(d => d.CreatedAt)
              .ToListAsync();
}
