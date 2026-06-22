---
title: Deferred execution em LINQ
description: IEnumerable vs IQueryable — quando a query realmente executa
emoji: 🔍
---

## Introdução

LINQ é **lazy** (preguiçoso). A query não executa quando você a escreve, mas quando você **consome** os dados (`.ToList()`, `.First()`, loop, etc). Isso é **deferred execution**.

**Implicação crítica:** `IQueryable` filtra **no banco** (SQL). `IEnumerable` filtra **em memória** (C#). Diferença de 10x na performance.

## Conceitos principais

### Execução imediata vs deferred

**Deferred:**
```csharp
var query = _db.Users.Where(u => u.Age > 18);  // Não executa ainda
// query ainda é IQueryable<User>, nenhuma query no BD
```

**Imediata (quando consome):**
```csharp
var users = query.ToList();  // ← AQUI executa a query
var first = query.First();   // ← AQUI executa a query
foreach (var u in query) { } // ← AQUI executa a query
```

### IQueryable vs IEnumerable

| | IQueryable | IEnumerable |
|---|---|---|
| **Onde filtra** | No banco (SQL) | Em memória (C#) |
| **Quando executa** | `.ToList()`, `.First()` | Imediatamente |
| **Performance** | Eficiente (big data) | Lento (big data) |
| **Operações** | SQL-only | Qualquer C# |

### Problema clássico: N+1

```csharp
// ❌ N+1: 1 query inicial + N queries no loop
var orders = _db.Orders.ToList();  // 1 query
foreach (var o in orders)
{
    var items = _db.OrderItems.Where(i => i.OrderId == o.Id).ToList();
    // N queries adicionais ❌
}

// ✅ Correto: 1 query com INNER JOIN
var orders = _db.Orders
    .Include(o => o.Items)  // ← Eager loading
    .ToList();  // 1 query
```

## Na prática

### AsEnumerable() muda tudo

```csharp
// ✅ Filtra no banco
var users = _db.Users
    .Where(u => u.Age > 18)
    .Where(u => u.Email.Contains("@gmail.com"))
    .ToList();
// SQL: SELECT * FROM Users WHERE Age > 18 AND Email LIKE '%@gmail.com%'

// ❌ Carrega TUDO e filtra em memória (500k usuários!)
var users = _db.Users
    .AsEnumerable()  // ← Muda para LINQ-to-Objects
    .Where(u => u.Age > 18)
    .Where(u => u.Email.Contains("@gmail.com"))
    .ToList();
// SQL: SELECT * FROM Users (carrega 500k)
// C#: filtra em memória (lento)
```

### Quando use AsEnumerable()

```csharp
// ✅ Legítimo: operação não-SQL em C#
var users = _db.Users
    .Where(u => u.Age > 18)
    .AsEnumerable()  // Continua com query anterior no banco
    .Where(u => u.CalculateScore() > 100)  // C# puro, não tem SQL
    .ToList();
```

### Rastreando deferred execution

```csharp
var query = _db.Users.Where(u => u.IsActive);
// Neste ponto: IQueryable<User>, nenhuma query executou

var moreFiltro = query.Where(u => u.Age > 18);
// Neste ponto: ainda é IQueryable<User>, nenhuma query

var enumerable = moreFiltro.AsEnumerable();
// Neste ponto: ainda é IEnumerable<User>, AINDA nenhuma query

var first = enumerable.FirstOrDefault();
// ← AQUI a query executa finalmente! (com os 2 filtros)
```

### Debugging: veja a SQL gerada

```csharp
var query = _db.Orders
    .Where(o => o.Total > 1000)
    .OrderByDescending(o => o.CreatedAt);

// Ver SQL gerada (antes de ToList!)
var sql = query.ToQueryString();
Console.WriteLine(sql);
// SELECT * FROM Orders WHERE Total > 1000 ORDER BY CreatedAt DESC

var orders = query.ToList();  // Executa
```

### Pagination (deferred ajuda)

```csharp
var pageSize = 20;
var pageNumber = 3;

// ✅ Filtra, ordena, paginamina NO BANCO (SQL OFFSET/FETCH)
var items = _db.Products
    .Where(p => p.Price < 100)
    .OrderBy(p => p.Name)
    .Skip((pageNumber - 1) * pageSize)
    .Take(pageSize)
    .ToList();
// SQL: SELECT * FROM Products WHERE Price < 100 ORDER BY Name OFFSET 40 ROWS FETCH NEXT 20 ROWS

// ❌ Carrega TUDO, depois pagina em memória
var items = _db.Products
    .Where(p => p.Price < 100)
    .AsEnumerable()
    .OrderBy(p => p.Name)
    .Skip((pageNumber - 1) * pageSize)
    .Take(pageSize)
    .ToList();
// Carrega milhões, depois paginamina em C# ❌
```

## Armadilhas comuns

❌ **Usar AsEnumerable() sem necessidade** → Carrega tudo em memória

❌ **ToList() dentro de loop** → Cada iteração = 1 query

❌ **Esquecer Include()** → N+1 queries silenciosamente

❌ **Filtros complexos em C#** → Use SQL quando possível

❌ **Não debugar com ToQueryString()** → Não vê a query real

## Referências

- [Microsoft Docs — Deferred Execution](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/deferred-execution-and-lazy-evaluation-in-linq)
- [Entity Framework Core — Performance](https://docs.microsoft.com/en-us/ef/core/performance/)
- [LINQ Best Practices](https://docs.microsoft.com/en-us/archive/msdn-magazine/2009/august/linq-to-sql-and-linq-to-objects-best-practices)
