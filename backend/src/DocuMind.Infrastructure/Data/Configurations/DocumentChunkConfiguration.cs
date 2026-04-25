namespace DocuMind.Infrastructure.Data.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Pgvector;
using DocuMind.Core.Entities;

public class DocumentChunkConfiguration : IEntityTypeConfiguration<DocumentChunk>
{
    public void Configure(EntityTypeBuilder<DocumentChunk> builder)
    {
        builder.ToTable("document_chunks");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.DocumentId)
            .IsRequired();

        builder.Property(c => c.ChunkIndex)
            .IsRequired();

        builder.Property(c => c.Content)
            .IsRequired()
            .HasColumnType("text");

        // Map float[] from Core to pgvector's Vector type in the database.
        // Dimension is 1536 (OpenAI); Ollama nomic-embed-text uses 768.
        // ValueComparer ensures EF detects changes to the array elements.
        builder.Property(c => c.Embedding)
            .HasColumnType("vector(1536)")
            .HasConversion(
                v => v == null ? null : new Vector(v),
                v => v == null ? null : v.ToArray()
            )
            .Metadata.SetValueComparer(new ValueComparer<float[]?>(
                (a, b) => a != null && b != null && a.SequenceEqual(b),
                v => v == null ? 0 : v.Aggregate(0, HashCode.Combine),
                v => v == null ? null : v.ToArray()
            ));

        builder.Property(c => c.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("now() at time zone 'utc'");

        builder.HasIndex(c => c.DocumentId);
    }
}
