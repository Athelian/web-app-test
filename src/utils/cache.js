// @flow

export const encryptValue = (value: Object): any => {
  return btoa(JSON.stringify(value));
};

export const decryptValue = (encryptedValue: string) => {
  try {
    return JSON.parse(atob(encryptedValue));
  } catch (e) {
    return null;
  }
};

export function getCache<T>(prefix: string, key: string): T | null {
  const result = window.localStorage.getItem(`${prefix}_${key}`);
  if (!result) {
    return null;
  }

  return decryptValue(result);
}

export function setCache<T>(prefix: string, key: string, value: T) {
  // $FlowFixMe
  window.localStorage.setItem(`${prefix}_${key}`, encryptValue(value));
}

export function invalidateCache(prefix: string) {
  const cacheKeys = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < window.localStorage.length; i++) {
    if (window.localStorage.key(i).indexOf(prefix) === 0) {
      cacheKeys.push(window.localStorage.key(i));
    }
  }

  cacheKeys.forEach(key => window.localStorage.removeItem(key));
}
