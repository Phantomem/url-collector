import NodeCache from 'node-cache';

const cache = new NodeCache();

export const set = (key: string, obj: unknown) => cache.set(key, obj);

export const get = <T>(key: string) => cache.get<T>(key);
