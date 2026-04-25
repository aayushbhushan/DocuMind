// IDocumentService is defined in DocuMind.Application.Services
// because it returns Application-layer DTOs (DocumentResponse).
// Keeping this file here would create a circular dependency:
//   Core → Application (for DTOs) → Core
namespace DocuMind.Core.Interfaces.Services;
