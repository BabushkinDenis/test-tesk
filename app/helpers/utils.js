/* eslint-disable no-restricted-syntax */
/* eslint-disable no-multi-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable guard-for-in */


export const getCookie = (name) => {
  const matches = document.cookie.match(new RegExp(
    // eslint-disable-next-line no-useless-escape
    `(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`,
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

export const setCookie = (name, value, options) => {
  options = options || {};
  let { expires } = options;
  if (typeof expires === 'number' && expires) {
    const d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }
  value = encodeURIComponent(value);
  let updatedCookie = `${name}=${value}`;
  for (const propName in options) {
    updatedCookie += `; ${propName}`;
    const propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += `=${propValue}`;
    }
  }
  document.cookie = updatedCookie;
};
