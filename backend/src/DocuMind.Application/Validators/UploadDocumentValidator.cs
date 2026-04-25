namespace DocuMind.Application.Validators;

using FluentValidation;
using DocuMind.Application.DTOs.Document;
using DocuMind.Core.Constants;

public class UploadDocumentValidator : AbstractValidator<UploadDocumentRequest>
{
    public UploadDocumentValidator()
    {
        RuleFor(x => x.File)
            .NotNull().WithMessage("A file must be provided.");

        RuleFor(x => x.File.Length)
            .LessThanOrEqualTo(AppConstants.MaxFileSizeBytes)
            .WithMessage($"File size must not exceed {AppConstants.MaxFileSizeBytes / 1024 / 1024} MB.")
            .When(x => x.File is not null);

        RuleFor(x => x.File.FileName)
            .Must(name => AppConstants.SupportedFileTypes.Contains(
                Path.GetExtension(name).ToLowerInvariant()))
            .WithMessage("Only .pdf and .txt files are supported.")
            .When(x => x.File is not null);
    }
}
