namespace DocuMind.Core.Interfaces.Repositories;

using DocuMind.Core.Entities;

public interface IDocumentRepository
{
    /// <summary>Persists a new document and returns it with the generated Id.</summary>
    Task<Document> CreateAsync(Document document);

    /// <summary>Returns a document by Id, or null if not found.</summary>
    Task<Document?> GetByIdAsync(int id);

    /// <summary>Returns all documents ordered by CreatedAt descending.</summary>
    Task<List<Document>> GetAllAsync();

    /// <summary>Deletes a document and its chunks by Id. Throws if not found.</summary>
    Task DeleteAsync(int id);
}
