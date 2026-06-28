---
title: Interfaces vs classes abstratas
description: Interface = contrato (o quê), Abstract = comportamento compartilhado (como)
emoji: 📐
tags: [csharp, dotnet, design]
---

## Introdução

**Interface** define um contrato: "implemente esses métodos". **Classe abstrata** fornece implementação parcial: "implemente esses, use meu código base". Escolher errado = código rígido e difícil de manter.

## Conceitos principais

### Quick decision tree

```
Você quer forçar um contrato? → Interface
Você quer compartilhar código? → Abstract class
Múltiplas herança? → Interface (classe herda 1, implementa N)
Campos/propriedades privadas? → Abstract class
Estado mutável compartilhado? → Abstract class
```

### Comparação

|                      | Interface                | Abstract                 |
| -------------------- | ------------------------ | ------------------------ |
| **Contrato**         | Sim, método = assinatura | Sim + implementação      |
| **Implementação**    | Nenhuma (C#8+: default)  | Parcial                  |
| **Fields/State**     | Não                      | Sim (private, protected) |
| **Herança múltipla** | Sim (N interfaces)       | Não (1 classe)           |
| **Constructor**      | Não                      | Sim                      |
| **Visibilidade**     | Sempre public            | public/protected/private |

## Na prática

### Use interface para contrato

```csharp
// Bom: interface define o contrato
interface IRepository<T>
{
    Task<T> GetById(int id);
    Task Add(T entity);
    Task Delete(int id);
}

class UserRepository : IRepository<User> { }
class ProductRepository : IRepository<Product> { }

// DI: não importa a implementação
public class OrderService
{
    private readonly IRepository<Order> _orders;
    public OrderService(IRepository<Order> orders) => _orders = orders;
}
```

### Use abstract para comportamento compartilhado

```csharp
// Ruim: interface não compartilha código
interface IEntity
{
    int Id { get; set; }
    DateTime CreatedAt { get; set; }
}

class User : IEntity // Cada classe reescreve Id + CreatedAt
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    // Duplicação de código!
}

// Bom: abstract compartilha
abstract class Entity
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

class User : Entity { }
class Product : Entity { }
// Código compartilhado ✅
```

### Default interface methods (C#8+)

```csharp
// Agora interfaces também podem ter implementação!
interface ILogger
{
    void Log(string message);

    void LogError(string message)
    {
        Log($"ERROR: {message}");
    }
}

class ConsoleLogger : ILogger
{
    public void Log(string message) => Console.WriteLine(message);
    // LogError herda a implementação padrão
}
```

### Composição over inheritance

```csharp
// ❌ Herança profunda (frágil)
class Repository { }
class UserRepository : Repository { }
class AdminRepository : UserRepository { } // Muito acoplado

// ✅ Composição (flexível)
class Repository
{
    private readonly ICache _cache;
    private readonly ILogger _logger;

    public Repository(ICache cache, ILogger logger)
    {
        _cache = cache;
        _logger = logger;
    }
}
```

## Armadilhas comuns

❌ **Usar abstract quando interface basta** → Limita a múltipla herança

❌ **Usar interface sem contrato claro** → Fica genérico demais

❌ **Herança profunda** → Preferir composição

❌ **Misturar conceitos** → Interface = contrato, abstract = implementação

## Referências

- [MSDN — Interfaces](https://docs.microsoft.com/en-us/dotnet/csharp/fundamentals/types/interfaces)
- [MSDN — Abstract Classes](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/abstract-and-sealed-classes-and-class-members)
- [Composition over Inheritance](https://en.wikipedia.org/wiki/Composition_over_inheritance)

## Ver também

- [Polymorphism em C#](./polymorphism.md)
- [Dependency Injection](../arquitetura/dependency-injection.md)
- [Design Patterns](../arquitetura/design-patterns.md)
