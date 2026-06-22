---
title: Async e await
description: State machine, cancellation tokens, ConfigureAwait — como async funciona
emoji: ⏳
---

## Introdução

`async/await` **não é multithreading**. É um state machine que **pausa** quando espera (I/O, network, etc) e **retoma** depois. Permite 1 thread servir 10.000 requests.

Compilador transforma seu código em state machine complexo — você vê elegância, máquina vê máquina de estados.

## Conceitos principais

### O que o compilador faz

```csharp
// Você escreve:
public async Task<User> GetUser(int id)
{
    var response = await _http.GetAsync($"api/users/{id}");
    return JsonSerializer.Deserialize<User>(response);
}

// Compilador cria state machine:
public Task<User> GetUser(int id)
{
    var stateMachine = new GetUserStateMachine();
    stateMachine._id = id;
    stateMachine._builder = AsyncTaskMethodBuilder<User>.Create();
    stateMachine._state = -1;
    stateMachine._builder.Start(ref stateMachine);
    return stateMachine._builder.Task;
}
```

### Cancellation tokens

```csharp
public async Task<User> GetUser(int id, CancellationToken ct)
{
    // Verifica se cancelou
    ct.ThrowIfCancellationRequested();

    var response = await _http.GetAsync($"api/users/{id}", ct);
    return JsonSerializer.Deserialize<User>(response);
}

// Uso
var cts = new CancellationTokenSource();
var task = GetUser(123, cts.Token);

// Cancelar depois de 5s
cts.CancelAfter(TimeSpan.FromSeconds(5));
```

### ConfigureAwait

```csharp
// ❌ Em library code: volta ao SynchronizationContext
var user = await _http.GetAsync("...");

// ✅ Em library code: não volta (mais rápido)
var user = await _http.GetAsync("...").ConfigureAwait(false);
```

## Na prática

### Evitar deadlock em ASP.NET

```csharp
// ❌ Deadlock em ASP.NET clássico
public ActionResult GetUser(int id)
{
    var user = _service.GetUserAsync(id).Result; // DEADLOCK!
    return Json(user);
}

// ✅ Async all the way
public async Task<ActionResult> GetUser(int id)
{
    var user = await _service.GetUserAsync(id);
    return Json(user);
}
```

### Parallel async

```csharp
// ❌ Sequencial (lento)
var user = await _userService.GetAsync(userId);
var orders = await _orderService.GetAsync(userId);
var payments = await _paymentService.GetAsync(userId);

// ✅ Paralelo (3x mais rápido)
var (user, orders, payments) = await (
    _userService.GetAsync(userId),
    _orderService.GetAsync(userId),
    _paymentService.GetAsync(userId)
);

// ou
var tasks = new[]
{
    _userService.GetAsync(userId),
    _orderService.GetAsync(userId),
    _paymentService.GetAsync(userId)
};
var results = await Task.WhenAll(tasks);
```

### With timeout

```csharp
public async Task<User> GetUserWithTimeout(int id)
{
    using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));

    try
    {
        return await _service.GetAsync(id, cts.Token);
    }
    catch (OperationCanceledException)
    {
        _logger.LogError($"Timeout para user {id}");
        throw;
    }
}
```

### Async void (armadilha!)

```csharp
// ❌ Nunca faça
public async void Button_Click()
{
    await _service.ProcessAsync(); // Exception não é capturada!
}

// ✅ Sempre Task
public async Task Button_Click()
{
    await _service.ProcessAsync();
}
```

## Armadilhas comuns

❌ **Async void** → Exceções invisíveis, impossível aguardar

❌ **Sync over async** → `Task.Result`, `.Wait()` → deadlock

❌ **Esquecer ConfigureAwait em library** → Retorna ao context (overhead)

❌ **Não passar CancellationToken** → Impossível cancelar

❌ **Await dentro de lock** → Pode deadlock

## Referências

- [MSDN — Async/Await](https://docs.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/)
- [Stephen Cleary — async/await Best Practices](https://docs.microsoft.com/en-us/archive/msdn-magazine/2013/march/async-await-best-practices-in-asynchronous-programming)
- [ConfigureAwait FAQ](https://devblogs.microsoft.com/dotnet/configureawait-faq/)
