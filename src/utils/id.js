// @flow
const SALT = 'zenport';

export const encodeId = (id: string) => encodeURIComponent(btoa(`${SALT}${id}`).replace(/=/g, ''));

export const decodeId = (id: string) => atob(decodeURIComponent(id)).replace(SALT, '');

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

export function injectUid(obj: Object) {
  const id = `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
  return { id, ...obj };
}
