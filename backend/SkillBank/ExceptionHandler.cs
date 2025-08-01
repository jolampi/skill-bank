using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace SkillBank;

internal sealed class ExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var problemDetails = GetDetails(exception);
        if (problemDetails is null)
        {
            return false;
        }
        httpContext.Response.StatusCode = problemDetails.Status ?? StatusCodes.Status500InternalServerError;
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);
        return true;
    }

    private static ProblemDetails? GetDetails(Exception exception)
    {
        if (exception is PostgresException)
        {
            return new ProblemDetails
            {
                Status = StatusCodes.Status502BadGateway,
                Title = "Bad Gateway",
            };
        }
        return null;
    }
}
