// Catches unhandled exceptions and returns a consistent JSON error response
namespace DocuMind.API.Middleware;

using System.Net;
using System.Text.Json;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger, IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.Response.ContentType = "application/json";
            var detail = _env.IsDevelopment() ? ex.ToString() : null;
            var error = new { error = _env.IsDevelopment() ? ex.Message : "An unexpected error occurred.", detail };
            await context.Response.WriteAsync(JsonSerializer.Serialize(error));
        }
    }
}
