---
title: Threading em C#
description: Sincronização, locks, concurrent collections — safe multi-thread
emoji: 🧵
---

## Introdução

**Threading** = múltiplas linhas de execução rodando em paralelo. Race condition = 2 threads mexem no mesmo dado ao mesmo tempo. `lock` previne, mas é slow. Melhor: imutabilidade ou concurrent collections.

## Conceitos principais

### Race condition

```csharp
// ❌ Race condition: 2 threads mexem em count simultaneamente
int count = 0;

Task.Run(() => {
    for (int i = 0; i < 1000000; i++)
        count++; // Lê, incrementa, escreve → não atomic
});
Task.Run(() => {
    for (int i = 0; i < 1000000; i++)
        count++;
});

// count deveria ser 2000000, mas é ~1500000 (loss of updates)
```

### Lock (simples, lento)

```csharp
private readonly object _lock = new();

public void IncrementSafe()
{
    lock (_lock)
    {
        count++; // Agora thread-safe, mas 1 thread por vez
    }
}
```

### Interlocked (fast, lock-free)

```csharp
// ✅ Atomic operation, rápido
Interlocked.Increment(ref count);
Interlocked.Add(ref count, 5);
Interlocked.CompareExchange(ref count, newValue, expectedValue);
```

## Na prática

### Async lock (SemaphoreSlim)

```csharp
private readonly SemaphoreSlim _semaphore = new SemaphoreSlim(1, 1);

public async Task<User> GetUserWithLockAsync(int id)
{
    await _semaphore.WaitAsync();
    try
    {
        return await _repository.GetAsync(id);
    }
    finally
    {
        _semaphore.Release();
    }
}
```

### Concurrent collections (zero lock needed)

```csharp
// ❌ Thread-unsafe
var list = new List<User>();
Task.Run(() => list.Add(user1));
Task.Run(() => list.Add(user2)); // Race condition!

// ✅ Thread-safe (internally uses lock-free algorithms)
var bag = new ConcurrentBag<User>();
Task.Run(() => bag.Add(user1));
Task.Run(() => bag.Add(user2));
```

### Which concurrent collection?

| Collection               | Use case                                            |
| ------------------------ | --------------------------------------------------- |
| **ConcurrentBag**        | Unordered, add/remove any                           |
| **ConcurrentQueue**      | FIFO, Enqueue/Dequeue                               |
| **ConcurrentStack**      | LIFO, Push/Pop                                      |
| **ConcurrentDictionary** | Thread-safe dictionary with atomic TryAdd/TryRemove |

### Imutabilidade (melhor estratégia)

```csharp
// ✅ Imutável: zero sincronização necessária
public record User(int Id, string Name);

var user1 = new User(1, "Alice");
var user2 = user1 with { Name = "Bob" }; // Cópia, não compartilha estado

Task.Run(() => Use(user1)); // Seguro
Task.Run(() => Use(user2)); // Seguro
```

### ReaderWriterLockSlim (leitura paralela)

```csharp
private readonly ReaderWriterLockSlim _rwLock = new();

public User GetUser(int id)
{
    _rwLock.EnterReadLock();
    try
    {
        return _cache[id]; // Múltiplos readers simultâneos
    }
    finally { _rwLock.ExitReadLock(); }
}

public void SetUser(int id, User user)
{
    _rwLock.EnterWriteLock();
    try
    {
        _cache[id] = user; // Exclusivo, readers esperan
    }
    finally { _rwLock.ExitWriteLock(); }
}
```

## Armadilhas comuns

❌ **lock com async** → Deadlock (use SemaphoreSlim)

❌ **Locks aninhados** → Deadlock (A espera B, B espera A)

❌ **Lock em loop** → Performance ruim

❌ **Não usar concurrent collections** → Manual lock é erro-prone

❌ **Ignorar imutabilidade** → Sync problem é solved

## Referências

- [MSDN — Threading](https://docs.microsoft.com/en-us/dotnet/api/system.threading)
- [Concurrent Collections](https://docs.microsoft.com/en-us/dotnet/standard/collections/thread-safe/)
- [Interlocked Operations](https://docs.microsoft.com/en-us/dotnet/api/system.threading.interlocked)
