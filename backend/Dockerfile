FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

COPY DocuMind.slnx .
COPY src/DocuMind.API/DocuMind.API.csproj src/DocuMind.API/
COPY src/DocuMind.Application/DocuMind.Application.csproj src/DocuMind.Application/
COPY src/DocuMind.Core/DocuMind.Core.csproj src/DocuMind.Core/
COPY src/DocuMind.Infrastructure/DocuMind.Infrastructure.csproj src/DocuMind.Infrastructure/

RUN dotnet restore src/DocuMind.API/DocuMind.API.csproj

COPY src/ src/

RUN dotnet publish src/DocuMind.API/DocuMind.API.csproj -c Release -o /app/out

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/out .
EXPOSE 10000
ENV ASPNETCORE_URLS=http://+:10000
ENTRYPOINT ["dotnet", "DocuMind.API.dll"]