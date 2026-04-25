namespace DocuMind.Application.Services;

using DocuMind.Core.Constants;

public class TextChunkingService
{
    /// <summary>
    /// Splits <paramref name="text"/> into overlapping word-based chunks.
    /// Each chunk contains <paramref name="chunkSize"/> words.
    /// Consecutive chunks share <paramref name="overlap"/> words for context continuity.
    /// </summary>
    /// <example>
    /// chunkSize=500, overlap=100 →
    ///   chunk 0: words[0..499]
    ///   chunk 1: words[400..899]
    ///   chunk 2: words[800..1299]
    /// </example>
    public List<string> ChunkText(
        string text,
        int chunkSize = AppConstants.DefaultChunkSize,
        int overlap = AppConstants.DefaultChunkOverlap)
    {
        var words = text.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        var chunks = new List<string>();
        var step = chunkSize - overlap;
        var index = 0;

        while (index < words.Length)
        {
            var window = words.Skip(index).Take(chunkSize);
            chunks.Add(string.Join(" ", window));
            index += step;
        }

        return chunks;
    }
}
