---
title: Dependency injection
description: Singleton, Scoped, Transient — lifetimes e captive dependency
emoji: 💉
---

## Introdução

**DI (Dependency Injection)** inverte controle: em vez de classe criar suas dependências, elas são **injetadas**. Desacopla, torna testável, permite trocar implementação sem mudar o código.

**Lifetimes** (Singleton/Scoped/Transient) controlam quantas instâncias existem.

## Conceitos principais

### Os 3 lifetimes

|                 | Singleton                  | Scoped                 | Transient          |
| --------------- | -------------------------- | ---------------------- | ------------------ |
| **Instâncias**  | 1 por app                  | 1 por request          | N (cada resolução) |
| **Memory**      | Alto (forever)             | Médio (request-scoped) | Baixo (GC limpa)   |
| **Thread-safe** | Deve ser                   | Pode ser mutable       | N/A                |
| **Use**         | Config, logging, factories | DbContext, UoW         | Stateless services |

### Captive dependency (armadilha!)

```csharp
// ❌ Erro: injetar Scoped em Singleton
services.AddSingleton<MyService>();         // Lifetime: Singleton
services.AddScoped<DbContext>();            // Lifetime: Scoped

public class MyService
{
    public MyService(DbContext db) { } // DbContext (Scoped) injetado em Singleton!
    // Resultado: DbContext vive enquanto app está rodando!
    // Não é descartado ao final de cada request
}

// ✅ Correto: injetar IServiceProvider
services.AddSingleton<MyService>();
services.AddScoped<DbContext>();

public class MyService
{
    private readonly IServiceProvider _provider;

    public MyService(IServiceProvider provider) => _provider = provider;

    public void DoWork()
    {
        using var scope = _provider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<DbContext>();
        // DbContext descartado ao final do using
    }
}
```

## Na prática

### Configuração básica (ASP.NET Core)

```csharp
var builder = WebApplication.CreateBuilder(args);

// Transient: nova instância cada vez
builder.Services.AddTransient<IValidator, Validator>();

// Scoped: 1 por request HTTP
builder.Services.AddScoped<IRepository, Repository>();
builder.Services.AddScoped<DbContext>();

// Singleton: 1 pra vida toda
builder.Services.AddSingleton<ILogger, ConsoleLogger>();
builder.Services.AddSingleton(Configuration);

var app = builder.Build();
```

### Factory pattern com DI

```csharp
// Quando criar a dependência é complexo
services.AddScoped<DbContext>(provider =>
{
    var config = provider.GetRequiredService<IConfiguration>();
    var connectionString = config.GetConnectionString("Default");
    return new DbContext(connectionString);
});
```

### IServiceScopeFactory (manual scopes)

```csharp
public class BackgroundJob
{
    private readonly IServiceScopeFactory _scopeFactory;

    public BackgroundJob(IServiceScopeFactory scopeFactory)
        => _scopeFactory = scopeFactory;

    public async Task ExecuteAsync()
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<DbContext>();

        // DbContext descartado automaticamente ao final do using
        await db.SaveChangesAsync();
    }
}
```

### Testing with DI

```csharp
[Fact]
public void UserService_CreateUser_SavesToRepository()
{
    // Arrange
    var mockRepository = new Mock<IUserRepository>();
    var service = new UserService(mockRepository.Object);

    // Act
    service.CreateUser(new User { Name = "Alice" });

    // Assert
    mockRepository.Verify(r => r.SaveAsync(It.IsAny<User>()), Times.Once);
}
```

## Armadilhas comuns

❌ **Captive dependency** → Scoped em Singleton

❌ **Não registrar dependência** → InvalidOperationException em runtime

❌ **Esquecer Dispose()** → Resource leak (conexões abertas)

❌ **Circular dependency** → A precisa de B, B precisa de A

❌ **Muito Singleton** → Acumula memória

## Referências

- [MSDN — Dependency Injection](https://docs.microsoft.com/en-us/dotnet/core/extensions/dependency-injection)
- [Microsoft DI Patterns](https://docs.microsoft.com/en-us/dotnet/core/extensions/dependency-injection-guidelines)
- [Captive Dependency](https://github.com/autofac/Autofac/wiki/Captive-Dependency-Issue)
