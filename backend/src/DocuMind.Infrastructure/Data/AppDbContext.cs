namespace DocuMind.Infrastructure.Data;

using System.Reflection;
using Microsoft.EntityFrameworkCore;
using DocuMind.Core.Entities;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Document> Documents => Set<Document>();
    public DbSet<DocumentChunk> DocumentChunks => Set<DocumentChunk>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Enable the pgvector extension in PostgreSQL
        modelBuilder.HasPostgresExtension("vector");

        // Apply all IEntityTypeConfiguration classes in this assembly
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Auto-update UpdatedAt on every save for Document entities
        foreach (var entry in ChangeTracker.Entries<Document>())
        {
            if (entry.State is EntityState.Added or EntityState.Modified)
                entry.Entity.UpdatedAt = DateTime.UtcNow;
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}
