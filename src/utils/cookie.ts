// src/utils/cookie.ts

import Cookies from 'js-cookie';

export const set_cookie = (key: string, value: string, options?: Cookies.CookieAttributes) => {
   Cookies.set(key, value, options);
};

export const get_cookie = (key: string) => {
   return Cookies.get(key);
};

export const remove_cookie = (key: string, options?: Cookies.CookieAttributes) => {
   Cookies.remove(key, options);
};

