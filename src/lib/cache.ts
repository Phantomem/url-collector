import NodeCache from 'node-cache';

const cache = new NodeCache();

export const set = (key, obj) => cache.set(key, obj);

export const get = <T>(key) => cache.get<T>(key);
