---
title: Immutability em C#
description: Records, with-expressions e por quê imutável = mais seguro
emoji: 🔒
---

## Introdução

**Imutável** = uma vez criado, não muda. `User` imutável nunca fica em estado inválido. Thread-safe sem locks. Fácil debugar.

**Records** (C#9+) fazem isso fácil: getter-only, `with`-expression, `Equals` por valor automático.

## Conceitos principais

### Records vs classes

| | Classe | Record |
|---|---|---|
| **Igualdade** | Por referência | Por valor ✅ |
| **ToString** | Object default | Automático ✅ |
| **Deconstruction** | Manual | Automático ✅ |
| **Mutação** | Permitida | Desencoraja |
| **Imutabilidade** | Manual (init) | Built-in |

### Record syntax

```csharp
// C#9 positional
public record User(int Id, string Name, string Email);

// C#9+ with-expressions
var user1 = new User(1, "Alice", "alice@example.com");
var user2 = user1 with { Name = "Bob" }; // Cria cópia com mudança
```

### Init-only properties

```csharp
public class Order
{
    public int Id { get; init; } // Só pode ser setado no constructor
    public decimal Total { get; init; }
}

var order = new Order { Id = 1, Total = 100 }; // OK
order.Total = 200; // Erro de compilação ✅
```

## Na prática

### Record com dados

```csharp
public record OrderCreated(
    int OrderId,
    DateTime CreatedAt,
    decimal Total
);

var @event = new OrderCreated(123, DateTime.UtcNow, 500);

// Equals funciona por valor (não por referência!)
var event2 = new OrderCreated(123, @event.CreatedAt, 500);
bool same = @event == event2; // true ✅
```

### With-expression para imutabilidade

```csharp
public record User(int Id, string Name, string Email);

var user = new User(1, "Alice", "alice@example.com");

// Sem mutar original
var updated = user with { Name = "Bob" };

Console.WriteLine(user.Name);    // Alice (original intacto)
Console.WriteLine(updated.Name); // Bob (nova instância)
```

### Thread-safe sem locks

```csharp
// ❌ Requer lock
public class MutableUser
{
    public string Name { get; set; }
    
    public void Update(Action<MutableUser> mutate)
    {
        lock (this) // Necessário!
        {
            mutate(this);
        }
    }
}

// ✅ Thread-safe naturalmente
public record User(int Id, string Name);

var user = new User(1, "Alice");
var updated = user with { Name = "Bob" }; // Sem lock, sem problema
```

### Deconstruction

```csharp
var order = new Order(123, 500m, "Shipped");

// Automaticamente em record
var (id, total, status) = order;

Console.WriteLine($"Pedido {id}: {status}");
```

## Armadilhas comuns

❌ **Record com propriedades mutáveis** → Quebra imutabilidade

❌ **Esquecer init em class** → Fica mutável inadvertidamente

❌ **Record muito grande** → Difícil usar with-expression

❌ **Comparar record com ==** → Funciona (por valor), mas cuidado com null

## Referências

- [MSDN — Records](https://docs.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-9#records)
- [Microsoft — Init-only properties](https://docs.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-9#init-only-properties)
- [Functional Programming in C#](https://www.manning.com/books/functional-programming-in-c-sharp)
