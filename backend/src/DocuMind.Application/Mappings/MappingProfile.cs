// AutoMapper profile mapping domain entities to API response DTOs
namespace DocuMind.Application.Mappings;

using AutoMapper;
using DocuMind.Core.Entities;
using DocuMind.Application.DTOs.Document;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Document, DocumentResponse>();
    }
}
