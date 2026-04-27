namespace DocuMind.Application.Services;

using DocuMind.Application.DTOs.Document;
using DocuMind.Core.Entities;
using DocuMind.Core.Interfaces.Repositories;
using DocuMind.Core.Interfaces.Services;
using Microsoft.AspNetCore.Http;

public class DocumentService : IDocumentService
{
    private readonly IDocumentRepository _documentRepository;
    private readonly IDocumentChunkRepository _chunkRepository;
    private readonly IFileProcessingService _fileProcessing;
    private readonly TextChunkingService _chunker;
    private readonly IAIService _aiService;

    public DocumentService(
        IDocumentRepository documentRepository,
        IDocumentChunkRepository chunkRepository,
        IFileProcessingService fileProcessing,
        TextChunkingService chunker,
        IAIService aiService)
    {
        _documentRepository = documentRepository;
        _chunkRepository = chunkRepository;
        _fileProcessing = fileProcessing;
        _chunker = chunker;
        _aiService = aiService;
    }

    /// <summary>
    /// Full upload pipeline: validate → extract text → chunk → persist document → persist chunks.
    /// </summary>
    public async Task<DocumentResponse> UploadDocumentAsync(IFormFile file)
    {
        if (file is null || file.Length == 0)
            throw new ArgumentException("File is null or empty.");

        // 1. Read raw bytes (needed for the file viewer) + extract text
        using var ms = new MemoryStream();
        await file.CopyToAsync(ms);
        var fileBytes = ms.ToArray();

        var rawText = await _fileProcessing.ExtractTextAsync(file);

        // 2. Split into overlapping word chunks
        var chunkStrings = _chunker.ChunkText(rawText);

        // 3. Build and persist the Document entity
        var document = new Document
        {
            FileName = file.FileName,
            FileType = Path.GetExtension(file.FileName).TrimStart('.').ToLower(),
            RawText = rawText,
            FileSize = file.Length,
            FileBytes = fileBytes
        };

        var saved = await _documentRepository.CreateAsync(document);

        // 4. Build and persist chunks (Embedding = null until Day 4)
        var chunks = chunkStrings
            .Select((content, index) => new DocumentChunk
            {
                DocumentId = saved.Id,
                ChunkIndex = index,
                Content = content,
                Embedding = null
            })
            .ToList();

        await _chunkRepository.CreateManyAsync(chunks);

        return new DocumentResponse
        {
            Id = saved.Id,
            FileName = saved.FileName,
            FileType = saved.FileType,
            FileSize = saved.FileSize,
            ChunkCount = chunks.Count,
            CreatedAt = saved.CreatedAt
        };
    }

    /// <summary>Returns a document by Id, or null if not found.</summary>
    public async Task<DocumentResponse?> GetDocumentAsync(int id)
    {
        var doc = await _documentRepository.GetByIdAsync(id);
        if (doc is null) return null;

        return new DocumentResponse
        {
            Id = doc.Id,
            FileName = doc.FileName,
            FileType = doc.FileType,
            FileSize = doc.FileSize,
            ChunkCount = doc.Chunks.Count,
            CreatedAt = doc.CreatedAt,
            RawText = doc.RawText,
            FileBytes = doc.FileBytes
        };
    }

    /// <summary>Returns all documents as lightweight summary objects.</summary>
    public async Task<List<DocumentSummaryResponse>> GetAllDocumentsAsync()
    {
        var docs = await _documentRepository.GetAllAsync();

        return docs.Select(doc => new DocumentSummaryResponse
        {
            Id = doc.Id,
            FileName = doc.FileName,
            FileType = doc.FileType,
            FileSize = doc.FileSize,
            CreatedAt = doc.CreatedAt
        }).ToList();
    }

    public async Task<int> GenerateEmbeddingsAsync(int documentId)
    {
        var chunks = await _chunkRepository.GetByDocumentIdAsync(documentId);

        foreach (var chunk in chunks)
        {
            var embedding = await _aiService.GenerateEmbeddingAsync(chunk.Content);
            await _chunkRepository.UpdateEmbeddingAsync(chunk.Id, embedding);
        }

        return chunks.Count;
    }

    public Task DeleteDocumentAsync(int id)
        => _documentRepository.DeleteAsync(id);
}
