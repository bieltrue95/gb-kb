---
title: REST API design
description: Controllers vs Minimal APIs, status codes, versionamento e convenções
emoji: 🌍
---

## Introdução

REST = Representational State Transfer. HTTP verbs (GET, POST, PUT, DELETE) + status codes + URLs lógicas. **Controllers** = classes tradicionais. **Minimal APIs** = endpoints inline, mais leves.

## Conceitos principais

### Status codes (critical!)

| Code | Meaning | Use |
|---|---|---|
| **200** | OK | Sucesso |
| **201** | Created | POST criou recurso |
| **204** | No Content | Sucesso, sem body |
| **400** | Bad Request | Input inválido |
| **401** | Unauthorized | Sem autenticação |
| **403** | Forbidden | Sem permissão |
| **404** | Not Found | Recurso não existe |
| **409** | Conflict | Duplicata, state conflict |
| **500** | Server Error | Erro interno |
| **503** | Service Unavailable | Temporariamente fora |

### Controllers vs Minimal APIs

```csharp
// Controllers (tradicional)
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var user = await _service.GetAsync(id);
        if (user == null) return NotFound();
        return Ok(user);
    }
}

// Minimal APIs (C#11+, leve)
app.MapGet("/api/users/{id}", async (int id, IUserService service) =>
{
    var user = await service.GetAsync(id);
    return user is null ? Results.NotFound() : Results.Ok(user);
});
```

### Versionamento

```csharp
// Header-based
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class OrdersController : ControllerBase { }

// URL-based (simpler)
[Route("api/v1/orders")]
public class OrdersV1Controller : ControllerBase { }
```

## Na prática

### Minimal API completa

```csharp
var builder = WebApplicationBuilder.CreateBuilder(args);
builder.Services.AddScoped<IUserService, UserService>();

var app = builder.Build();

app.MapGet("/api/users/{id}", GetUser);
app.MapPost("/api/users", CreateUser);
app.MapPut("/api/users/{id}", UpdateUser);
app.MapDelete("/api/users/{id}", DeleteUser);

app.Run();

async Task<IResult> GetUser(int id, IUserService service)
{
    var user = await service.GetAsync(id);
    return user is null ? Results.NotFound() : Results.Ok(user);
}

async Task<IResult> CreateUser(CreateUserDto dto, IUserService service)
{
    try
    {
        var user = await service.CreateAsync(dto);
        return Results.Created($"/api/users/{user.Id}", user);
    }
    catch (ValidationException ex)
    {
        return Results.BadRequest(ex.Message);
    }
}

async Task<IResult> UpdateUser(int id, UpdateUserDto dto, IUserService service)
{
    var result = await service.UpdateAsync(id, dto);
    return result ? Results.NoContent() : Results.NotFound();
}

async Task<IResult> DeleteUser(int id, IUserService service)
{
    var result = await service.DeleteAsync(id);
    return result ? Results.NoContent() : Results.NotFound();
}
```

### Problem Details (RFC 7231)

```csharp
app.UseExceptionHandler(builder =>
{
    builder.Run(async context =>
    {
        var error = context.Features.Get<IExceptionHandlerPathFeature>();
        var response = new ProblemDetails
        {
            Status = StatusCodes.Status500InternalServerError,
            Title = "Internal Server Error",
            Detail = error?.Error.Message
        };
        context.Response.StatusCode = response.Status.Value;
        await context.Response.WriteAsJsonAsync(response);
    });
});
```

## Armadilhas comuns

❌ **Retornar 200 com erro** → Use status codes corretos

❌ **Misturar HTTP verbs** → GET não muta, DELETE não retorna body

❌ **IDs expostos** → Use GUIDs ou hashes

❌ **Sem rate limiting** → Aberto a abuso

## Referências

- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://httpwg.org/specs/rfc7231.html)
- [ASP.NET Core Minimal APIs](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis)
