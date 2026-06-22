---
title: Memory e Span<T>
description: Stack vs heap, Span/Memory — zero-allocation performance
emoji: 🧠
---

## Introdução

**Stack** = rápido, automático, limitado. **Heap** = lento (GC), ilimitado. `Span<T>` permite trabalhar com dados no stack sem copiar.

Em hot paths (parsing, encoding): `Span` pode ser 10x mais rápido que `string` ou `byte[]`.

## Conceitos principais

### Stack vs Heap

```csharp
// Stack: automático, rápido, ~1MB limite
int age = 30;          // 4 bytes on stack
int[] numbers = ...    // referência (8 bytes) on stack, dados on heap

// Heap: GC gerencia, lento, ilimitado
var user = new User(); // Allocated on heap, GC cleans up depois
```

### Span<T>

```csharp
// ✅ Zero-allocation: Span é valor type (stack-allocated)
Span<int> numbers = stackalloc int[10];
numbers[0] = 1;
numbers[1] = 2;
// Sem alocação de heap!
```

### Memory<T> (async-safe)

```csharp
// Stack-allocated Span não pode atravessar async await
// Memory<T> wraps array, pode ser async

public async Task ProcessAsync(Memory<byte> buffer)
{
    await _stream.ReadAsync(buffer);
    // Usa buffer depois
}
```

## Na prática

### Parsing com Span (zero-alloc)

```csharp
// ❌ Com string: aloca array, aloca string, GC later
var parts = "1,2,3,4,5".Split(','); // Heap allocation
foreach (var p in parts)
    Console.WriteLine(int.Parse(p));

// ✅ Com Span: tudo no stack
ReadOnlySpan<char> input = "1,2,3,4,5";
foreach (var item in input.Split(','))
{
    int.TryParse(item, out var num);
    Console.WriteLine(num); // Zero allocations
}
```

### Encoding/Decoding without allocation

```csharp
public class MessageParser
{
    // ❌ Aloca string
    public Message Parse(string json)
    {
        return JsonSerializer.Deserialize<Message>(json);
    }

    // ✅ Usa Span, zero alocação extra
    public Message ParseSpan(ReadOnlySpan<byte> utf8Json)
    {
        return JsonSerializer.Deserialize<Message>(utf8Json);
    }
}
```

### Struct with Span (careful!)

```csharp
// ❌ Span em class é problem (Span é ref type em tamanho)
public class Parser
{
    public void Parse(ReadOnlySpan<char> input) { }
}

// ✅ Span em struct é ok (struct can point to stack memory)
public struct FastParser
{
    public void Parse(ReadOnlySpan<char> input) { }
}
```

### stackalloc para arrays temporários

```csharp
public byte[] ComputeHash(ReadOnlySpan<byte> data)
{
    // Temporário: no stack, se < 64 bytes
    Span<byte> hash = stackalloc byte[32];

    using var algo = System.Security.Cryptography.SHA256.Create();
    algo.TryComputeHash(data, hash, out var written);

    return hash.ToArray(); // Só aqui aloca heap
}
```

### Pooling (reuse allocated buffers)

```csharp
// Evita allocation em hot paths
private static readonly ArrayPool<byte> _pool = ArrayPool<byte>.Shared;

public void ProcessLargeData(byte[] data)
{
    var buffer = _pool.Rent(1024 * 1024); // Get from pool, reuse
    try
    {
        // Usa buffer
    }
    finally
    {
        _pool.Return(buffer); // Return to pool
    }
}
```

## Armadilhas comuns

❌ **Span beyond method boundary** → Stack memory pode ser overwritten

❌ **Span em class field** → Dangerous (class is on heap, span points to stack)

❌ **stackalloc com loop** → Cada iteração aloca novo buffer

❌ **Esquecer que Span é mutable** → Careful com modificações

## Referências

- [MSDN — Span<T>](https://docs.microsoft.com/en-us/dotnet/api/system.span-1)
- [MSDN — Memory<T>](https://docs.microsoft.com/en-us/dotnet/api/system.memory-1)
- [stackalloc](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/operators/stackalloc)
- [ArrayPool](https://docs.microsoft.com/en-us/dotnet/api/system.buffers.arraypool-1)
