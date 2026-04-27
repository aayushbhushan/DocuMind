FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

COPY DocuMind.slnx .
COPY src/DocuMind.API/DocuMind.API.csproj src/DocuMind.API/
COPY src/DocuMind.Application/DocuMind.Application.csproj src/DocuMind.Application/
COPY src/DocuMind.Core/DocuMind.Core.csproj src/DocuMind.Core/
COPY src/DocuMind.Infrastructure/DocuMind.Infrastructure.csproj src/DocuMind.Infrastructure/
COPY tests/DocuMind.Tests/DocuMind.Tests.csproj tests/DocuMind.Tests/

RUN dotnet restore DocuMind.slnx

COPY src/ src/
COPY tests/ tests/

RUN find . -name "*.resx" -delete && \
    find . -type d -name "bin" -exec rm -rf {} + 2>/dev/null || true && \
    find . -type d -name "obj" -exec rm -rf {} + 2>/dev/null || true

RUN dotnet publish src/DocuMind.API/DocuMind.API.csproj -c Release -o /app/out

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/out .
EXPOSE 10000
ENV ASPNETCORE_URLS=http://+:10000
ENTRYPOINT ["dotnet", "DocuMind.API.dll"]