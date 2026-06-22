---
title: Caching
description: IMemoryCache, IDistributedCache, cache-aside pattern, TTL
emoji: 💾
---

## Introdução

Cache = armazenar dados para rápido acesso. **IMemoryCache** = em processo (rápido, isolado). **IDistributedCache** = Redis/SQL (compartilhado, lento). **Cache-aside** = busca do cache, se não achou vai no BD.

## Conceitos principais

### IMemoryCache (in-process)

```csharp
// Usar
services.AddMemoryCache();

public class UserService
{
    private readonly IMemoryCache _cache;
    
    public async Task<User> GetUserAsync(int id)
    {
        if (_cache.TryGetValue($"user_{id}", out User user))
            return user;
        
        user = await _db.Users.FindAsync(id);
        _cache.Set($"user_{id}", user, TimeSpan.FromMinutes(10));
        return user;
    }
}
```

### IDistributedCache (Redis)

```csharp
// Setup
services.AddStackExchangeRedisCache(options =>
    options.Configuration = "localhost:6379");

public class CachedUserService
{
    private readonly IDistributedCache _cache;
    
    public async Task<User> GetUserAsync(int id)
    {
        var cached = await _cache.GetStringAsync($"user_{id}");
        if (cached != null)
            return JsonSerializer.Deserialize<User>(cached);
        
        var user = await _db.Users.FindAsync(id);
        await _cache.SetStringAsync($"user_{id}", 
            JsonSerializer.Serialize(user),
            new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10) });
        
        return user;
    }
}
```

### Cache-aside pattern

```csharp
public async Task<Product> GetProductAsync(int id)
{
    var key = $"product_{id}";
    
    // 1. Tenta cache
    var cached = await _redis.GetStringAsync(key);
    if (cached != null)
        return JsonSerializer.Deserialize<Product>(cached);
    
    // 2. Cache miss → BD
    var product = await _db.Products.FindAsync(id);
    if (product == null)
        return null;
    
    // 3. Armazena no cache
    await _redis.SetStringAsync(key, JsonSerializer.Serialize(product),
        new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1) });
    
    return product;
}
```

## Na prática

### Cache com tags (invalidação)

```csharp
public async Task InvalidateUserCacheAsync(int userId)
{
    await _cache.RemoveAsync($"user_{userId}");
    await _cache.RemoveAsync($"user_list");
}

public async Task<List<User>> GetUsersAsync()
{
    var key = "user_list";
    var cached = await _cache.GetStringAsync(key);
    if (cached != null)
        return JsonSerializer.Deserialize<List<User>>(cached);
    
    var users = await _db.Users.ToListAsync();
    await _cache.SetStringAsync(key, JsonSerializer.Serialize(users),
        new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30) });
    
    return users;
}
```

### Cache com evento (event-driven invalidation)

```csharp
public class UserService
{
    public async Task UpdateUserAsync(User user)
    {
        await _db.SaveChangesAsync();
        
        // Invalida cache
        await _cache.RemoveAsync($"user_{user.Id}");
        await _mediator.Publish(new UserUpdated(user.Id));
    }
}
```

## Armadilhas comuns

❌ **Cache sem TTL** → Dados defasados eternamente

❌ **Cache em tudo** → Overhead, não compensa

❌ **Invalidação manual** → Esquece em um lugar, fica consistente

❌ **Serializar objetos grandes** → Lento, memoria gasta

## Referências

- [IMemoryCache](https://learn.microsoft.com/en-us/aspnet/core/performance/caching/memory)
- [Distributed Cache](https://learn.microsoft.com/en-us/aspnet/core/performance/caching/distributed)
- [Redis Cache Provider](https://github.com/StackExchange/StackExchange.Redis)
