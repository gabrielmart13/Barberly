
using Barberly.API.Exceptions;

namespace Barberly.API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(
            RequestDelegate next,
            ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                if (context.Response.HasStarted)
                {
                    _logger.LogError(
                        ex,
                        "A resposta já havia começado quando ocorreu uma exceção."
                    );

                    throw;
                }

                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(
            HttpContext context,
            Exception exception)
        {
            int statusCode;
            string code;
            string message;

            switch (exception)
            {
                case NotFoundException:
                    statusCode = StatusCodes.Status404NotFound;
                    code = "NOT_FOUND";
                    message = exception.Message;
                    break;

                case Barberly.API.Exceptions.ValidationException:
                    statusCode = StatusCodes.Status400BadRequest;
                    code = "VALIDATION_ERROR";
                    message = exception.Message;
                    break;

                case ConflictException:
                    statusCode = StatusCodes.Status409Conflict;
                    code = "CONFLICT";
                    message = exception.Message;
                    break;

                default:
                    statusCode = StatusCodes.Status500InternalServerError;
                    code = "INTERNAL_SERVER_ERROR";
                    message = "Ocorreu um erro interno no servidor.";

                    _logger.LogError(
                        exception,
                        "Erro não tratado durante o processamento da requisição."
                    );
                    break;
            }

            context.Response.Clear();
            context.Response.StatusCode = statusCode;

            var response = new
            {
                status = statusCode,
                code,
                message,
                timestamp = DateTime.UtcNow,
                path = context.Request.Path.Value
            };

            await context.Response.WriteAsJsonAsync(response);
        }
    }
}
