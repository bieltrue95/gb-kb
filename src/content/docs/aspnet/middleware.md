---
title: Middleware e pipeline
description: Pipeline de request, middleware custom, ordem crítica
emoji: 🔧
---

## Introdução

**Middleware** = componentes que processam requests/responses. ASP.NET Core é uma pipeline: request → middleware1 → middleware2 → ... → handler → response. **Ordem importa!**

## Conceitos principais

### Pipeline order (crítico)

```
Request →
  [Exception Handler] 
  [CORS]
  [Authentication]
  [Authorization]
  [Custom middleware]
  [Endpoint] → Response
```

Errar a ordem = security hole ou funcionalidade quebrada.

### Built-in middleware

```csharp
var app = builder.Build();

app.UseExceptionHandler();           // 1º: captura erros
app.UseRouting();                    // Resolve rota
app.UseCors();                       // Valida CORS
app.UseAuthentication();             // Identifica usuário
app.UseAuthorization();              // Valida permissões
app.MapControllers();                // Executa handler
app.Run();
```

## Na prática

### Custom middleware (3 formas)

```csharp
// 1. Inline (simples)
app.Use(async (context, next) =>
{
    await next(); // Chama próximo middleware
});

// 2. Classe (reutilizável)
public class LoggingMiddleware
{
    private readonly RequestDelegate _next;
    
    public LoggingMiddleware(RequestDelegate next) => _next = next;
    
    public async Task InvokeAsync(HttpContext context)
    {
        _logger.LogInformation($"{context.Request.Method} {context.Request.Path}");
        await _next(context);
        _logger.LogInformation($"Response: {context.Response.StatusCode}");
    }
}

// Usar:
app.UseMiddleware<LoggingMiddleware>();

// 3. Extension method (padrão)
public static class MiddlewareExtensions
{
    public static IApplicationBuilder UseLogging(this IApplicationBuilder app)
        => app.UseMiddleware<LoggingMiddleware>();
}

app.UseLogging();
```

### Middleware com dependências

```csharp
public class AuthMiddleware
{
    private readonly RequestDelegate _next;
    
    public AuthMiddleware(RequestDelegate next) => _next = next;
    
    public async Task InvokeAsync(HttpContext context, IAuthService authService)
    {
        var token = context.Request.Headers["Authorization"].ToString();
        if (!string.IsNullOrEmpty(token))
        {
            context.User = await authService.ValidateTokenAsync(token);
        }
        
        await _next(context);
    }
}
```

### Short-circuit (parar pipeline)

```csharp
app.Use(async (context, next) =>
{
    if (context.Request.Path == "/health")
    {
        context.Response.StatusCode = 200;
        await context.Response.WriteAsync("OK");
        return; // Não chama next = para a pipeline
    }
    
    await next();
});
```

## Armadilhas comuns

❌ **UseAuthentication antes UseRouting** → Routing não funciona

❌ **UseAuthorization antes UseAuthentication** → Sempre nega

❌ **Middleware depois de MapControllers** → Nunca é chamado

❌ **Middleware lento no início** → Afeta todas as requisições

## Referências

- [ASP.NET Core Middleware](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/middleware)
- [Middleware Order](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/middleware/middleware-order)
