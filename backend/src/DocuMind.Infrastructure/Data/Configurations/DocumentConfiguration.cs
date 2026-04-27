namespace DocuMind.Infrastructure.Data.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DocuMind.Core.Entities;

public class DocumentConfiguration : IEntityTypeConfiguration<Document>
{
    public void Configure(EntityTypeBuilder<Document> builder)
    {
        builder.ToTable("documents");

        builder.HasKey(d => d.Id);

        builder.Property(d => d.FileName)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(d => d.FileType)
            .IsRequired()
            .HasMaxLength(10);

        builder.Property(d => d.RawText)
            .IsRequired()
            .HasColumnType("text");

        builder.Property(d => d.FileSize)
            .IsRequired();

        // bytea column — nullable because existing rows have no stored file yet
        builder.Property(d => d.FileBytes)
            .HasColumnType("bytea")
            .IsRequired(false);

        builder.Property(d => d.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("now() at time zone 'utc'");

        builder.Property(d => d.UpdatedAt)
            .IsRequired()
            .HasDefaultValueSql("now() at time zone 'utc'");

        builder.HasMany(d => d.Chunks)
            .WithOne(c => c.Document)
            .HasForeignKey(c => c.DocumentId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
