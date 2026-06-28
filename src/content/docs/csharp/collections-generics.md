---
title: Collections e generics
description: Array vs List vs HashSet — Big-O e quando usar cada uma
emoji: 📦
tags: [csharp, dotnet, performance]
---

## Introdução

Escolher a collection errada = seu código é lento. `List<T>` tem O(n) busca. `HashSet<T>` tem O(1). Para 1 milhão de items: diferença entre 1ms e 1 segundo.

**Generics** tornam collections type-safe: `List<User>` em vez de `List<object>` sem casting.

## Conceitos principais

### Big-O comparison

| Operação      | Array | List     | HashSet  | Dict     | Queue    | Stack    |
| ------------- | ----- | -------- | -------- | -------- | -------- | -------- |
| **Acesso[i]** | O(1)  | O(1)     | O(1)     | O(1)     | O(n)     | O(n)     |
| **Busca**     | O(n)  | O(n)     | **O(1)** | **O(1)** | O(n)     | O(n)     |
| **Inserir**   | O(n)  | O(n)\*   | **O(1)** | **O(1)** | O(1)     | **O(1)** |
| **Remover**   | O(n)  | O(n)\*   | **O(1)** | **O(1)** | **O(1)** | **O(1)** |
| **Memory**    | Fixo  | Dinâmico | Dinâmico | Dinâmico | Dinâmico | Dinâmico |

\*List no final é O(1) amortizado

### Quando usar cada uma

| Collection          | Caso de uso                            |
| ------------------- | -------------------------------------- |
| **Array**           | Tamanho fixo, acesso por índice        |
| **List<T>**         | Padrão, adicionar/remover no final     |
| **HashSet<T>**      | Verificar se existe, sem duplicatas    |
| **Dictionary<K,V>** | Map key → value (lookup rápido)        |
| **Queue<T>**        | FIFO (primeiro entra, primeiro sai)    |
| **Stack<T>**        | LIFO (último entra, primeiro sai)      |
| **LinkedList<T>**   | Inserir/remover no meio com frequência |
| **SortedSet<T>**    | Manter ordenado, busca rápida          |

## Na prática

### Busca: HashSet vs List

```csharp
var users = new List<int> { 1, 2, 3, ... 1_000_000 };

// ❌ O(n) - varre toda a lista
bool exists = users.Contains(999_999); // ~1 segundo

// ✅ O(1) - hash lookup instant
var userSet = new HashSet<int> { 1, 2, 3, ... 1_000_000 };
bool exists = userSet.Contains(999_999); // ~1 microsecond
```

### Duplicatas: HashSet garante

```csharp
// ❌ List permite duplicatas
var ids = new List<int> { 1, 1, 2, 2, 3 };

// ✅ HashSet remove duplicatas automaticamente
var ids = new HashSet<int> { 1, 1, 2, 2, 3 }; // {1, 2, 3}
```

### Dictionary: Lookup por chave

```csharp
// ❌ O(n) cada busca
var users = new List<User> { ... };
var user = users.FirstOrDefault(u => u.Id == 123);

// ✅ O(1)
var users = new Dictionary<int, User>();
users[123]; // Instant lookup
```

### Queue vs Stack

```csharp
// Queue = FIFO (fila de atendimento)
var queue = new Queue<Customer>();
queue.Enqueue(customer1);
queue.Enqueue(customer2);
var next = queue.Dequeue(); // customer1 (primeiro que entrou)

// Stack = LIFO (desfazer/redo, DFS)
var stack = new Stack<string>();
stack.Push("operacao1");
stack.Push("operacao2");
var undo = stack.Pop(); // operacao2 (último que entrou)
```

### LinkedList: Inserir no meio

```csharp
// ❌ List.Insert(index, item) é O(n)
var list = new List<int>(1_000_000);
list.Insert(500_000, 999); // Move 500k elementos!

// ✅ LinkedList é O(1) se tem a referência ao nó
var linked = new LinkedList<int>();
var node = linked.AddLast(500_000); // Referência ao nó
linked.AddBefore(node, 999); // O(1) inserção
```

### Generics: Type safety

```csharp
// ❌ Sem generics (boxing/unboxing overhead)
var list = new ArrayList();
list.Add(123); // Boxing
var value = (int)list[0]; // Unboxing + cast

// ✅ Com generics (zero overhead)
var list = new List<int>();
list.Add(123); // Sem boxing
var value = list[0]; // Sem unboxing
```

## Armadilhas comuns

❌ **Usar List com .Contains() em loop** → O(n²) para n items

❌ **Esquecer que HashSet não tem ordem** → Pode virar random

❌ **Dictionary com key que muda** → Quebra o hash

❌ **Array.Resize() em loop** → O(n²), use List

## Referências

- [MSDN — Collections](https://docs.microsoft.com/en-us/dotnet/api/system.collections.generic)
- [Big-O Complexity Chart](https://bigocheatsheet.com/)
- [Generics in C#](https://docs.microsoft.com/en-us/dotnet/csharp/fundamentals/generics/)

## Ver também

- [LINQ e Deferred Execution](../async/linq.md)
- [Memory e Span<T>](../async/memory-span.md)
- [Immutability em C#](./immutability.md)
