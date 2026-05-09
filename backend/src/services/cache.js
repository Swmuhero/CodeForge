const store = new Map();

export function getCache(key) {
  const item = store.get(key);
  if (!item) {
    return null;
  }

  if (Date.now() > item.expiresAt) {
    store.delete(key);
    return null;
  }

  return item.value;
}

export function setCache(key, value, ttlMs = 30000) {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlMs
  });
}

export function clearCache() {
  store.clear();
}
