---
title: EF Core basics
description: DbContext lifecycle, migrations, change tracking, relacionamentos 1:1/1:N/N:N
emoji: 🗄️
tags: [data, efcore, dotnet]
---

## Introdução

**EF Core** = ORM (Object-Relational Mapping). **DbContext** = session com BD. **Migrations** = versionamento de schema. **Change tracker** = rastreia o que mudou.

## Conceitos principais

### DbContext lifecycle

```csharp
using var context = new AppDbContext();

// 1. Query: rastreia mudanças
var user = context.Users.Find(1);

// 2. Modify
user.Name = "Bob";

// 3. SaveChanges: flush para BD
await context.SaveChangesAsync();
// UPDATE Users SET Name = 'Bob' WHERE Id = 1
```

### Relacionamentos

```csharp
// 1:N (um usuário, muitos pedidos)
public class User { public List<Order> Orders { get; set; } }
public class Order { public int UserId { get; set; } }

// N:N (muitos produtos, muitas categorias)
public class ProductCategory { public int ProductId { get; set; } public int CategoryId { get; set; } }
modelBuilder.Entity<ProductCategory>().HasKey(x => new { x.ProductId, x.CategoryId });

// 1:1 (usuário, perfil)
public class User { public Profile Profile { get; set; } }
public class Profile { public int UserId { get; set; } }
```

## Na prática

### Fluent API (recomendado)

```csharp
protected override void OnModelCreating(ModelBuilder mb)
{
    mb.Entity<Order>()
        .HasOne(o => o.User)
        .WithMany(u => u.Orders)
        .HasForeignKey(o => o.UserId)
        .OnDelete(DeleteBehavior.Cascade);
}
```

### Migrations

```bash
# Criar
dotnet ef migrations add AddUserTable

# Aplicar
dotnet ef database update

# Reverter
dotnet ef migrations remove
```

### AsNoTracking (performance)

```csharp
// Padrão: rastreia
var users = await context.Users.ToListAsync(); // Mais memória

// AsNoTracking: não rastreia
var users = await context.Users.AsNoTracking().ToListAsync(); // Mais rápido, read-only
```

## Armadilhas comuns

❌ **Sem migrations** → Schema desynced

❌ **Include() mal planejado** → N+1 queries

❌ **SaveChanges() em loop** → Lento (batching melhor)

## Referências

- [EF Core Docs](https://docs.microsoft.com/en-us/ef/core/)
- [Relationships](https://docs.microsoft.com/en-us/ef/core/modeling/relationships)
- [Change Tracking](https://docs.microsoft.com/en-us/ef/core/change-tracking/)

## Ver também

- [Unit of Work Pattern](../dotnet/unit-of-work.md)
- [CQRS e Event Sourcing](../arquitetura/cqrs.md)
- [Deferred Execution em LINQ](../distribuidos/deferred-execution.md)
- [LINQ e Deferred Execution](../async/linq.md)
