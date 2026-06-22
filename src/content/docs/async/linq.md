---
title: LINQ e deferred execution
description: Lazy evaluation, expression trees, performance gotchas
emoji: 🔗
---

## Introdução

LINQ é **lazy**: a query não executa quando escrita, mas quando consumida. `IQueryable` traduz pra SQL (rápido). `IEnumerable` executa em C# (lento em big data).

Conhecer isso = diferença entre app rápido e slow.

## Conceitos principais

### Deferred execution

```csharp
var query = _db.Users.Where(u => u.Age > 18); // Não executa
var query2 = query.OrderBy(u => u.Name);      // Não executa
var users = query2.ToList();                   // ← AQUI executa (2 filtros combinados)
```

### Expression trees (IQueryable)

Quando você escreve:
```csharp
var query = _db.Users.Where(u => u.Age > 18);
```

O compilador traduz `u => u.Age > 18` pra **expression tree**, não executa a lambda. Depois o `DbContext` traduz tree → SQL:

```sql
SELECT * FROM Users WHERE Age > 18
```

### Closures em LINQ

```csharp
// ❌ Closure problem
var min = 18;
var query = _db.Users.Where(u => u.Age > min).ToList(); // OK
min = 21;
// query ainda usa min=21! Closure capturou referência, não valor

// ✅ Evitar: copiar valor
var minAge = min;
var query = _db.Users.Where(u => u.Age > minAge).ToList();
```

## Na prática

### Debugging: ver SQL gerado

```csharp
var query = _db.Users
    .Where(u => u.Active)
    .OrderBy(u => u.Name);

// Ver SQL ANTES de executar
var sql = query.ToQueryString();
Console.WriteLine(sql);
// SELECT * FROM Users WHERE Active = 1 ORDER BY Name

var users = query.ToList(); // Executa
```

### Performance: where antes de select

```csharp
// ❌ Lento: carrega todos os dados, depois filtra
var names = _db.Users.ToList() // Carrega millions
    .Where(u => u.Age > 18)
    .Select(u => u.Name)
    .ToList();

// ✅ Rápido: filtra no banco, depois seleciona
var names = _db.Users
    .Where(u => u.Age > 18)
    .Select(u => u.Name)
    .ToList();
```

### Avoid N+1 with Include

```csharp
// ❌ N+1: 1 query + N queries no loop
var orders = _db.Orders.ToList();
foreach (var o in orders)
{
    var items = _db.OrderItems.Where(i => i.OrderId == o.Id).ToList(); // N queries!
}

// ✅ 1 query com JOIN
var orders = _db.Orders.Include(o => o.Items).ToList();
foreach (var o in orders)
{
    var items = o.Items; // Já carregado
}
```

### Select before ToList

```csharp
// ❌ Carrega objects inteiros
var orders = _db.Orders.ToList().Select(o => new { o.Id, o.Total });

// ✅ Projection no banco
var orders = _db.Orders.Select(o => new { o.Id, o.Total }).ToList();
```

## Armadilhas comuns

❌ **Chamar .ToList() cedo demais** → Carrega tudo em memória

❌ **Usar .AsEnumerable() sem necessidade** → LINQ-to-Objects é lento

❌ **Closure capturing** → Valores mudam entre escrita da query e execução

❌ **Complex LINQ no banco** → Alguns Where() não traduzem pra SQL

❌ **Lazy execution surpresa** → Query lista dentro de loop executa N vezes

## Referências

- [MSDN — Deferred Execution](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/deferred-execution-and-lazy-evaluation-in-linq)
- [Entity Framework — SQL Translation](https://docs.microsoft.com/en-us/ef/core/querying/how-query-works)
- [LINQ Performance](https://docs.microsoft.com/en-us/dotnet/framework/data/adonet/ef/language-reference/linq-to-entities-queries)
