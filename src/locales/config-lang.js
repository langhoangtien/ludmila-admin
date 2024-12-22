// PLEASE REMOVE `LOCAL STORAGE` WHEN YOU CHANGE SETTINGS.
// ----------------------------------------------------------------------

export const allLangs = [
  {
    label: 'Vietnamese',
    value: 'vi',

    icon: 'flagpack:vn',
    numberFormat: {
      code: 'vi-VN',
      currency: 'VND',
    },
  },
  {
    label: 'English',
    value: 'en',

    icon: 'flagpack:gb-nir',
    numberFormat: {
      code: 'en-US',
      currency: 'USD',
    },
  },
  {
    label: 'French',
    value: 'fr',

    icon: 'flagpack:fr',
    numberFormat: {
      code: 'fr-Fr',
      currency: 'EUR',
    },
  },

  {
    label: 'Chinese',
    value: 'cn',

    icon: 'flagpack:cn',
    numberFormat: {
      code: 'zh-CN',
      currency: 'CNY',
    },
  },
];

export const defaultLang = allLangs[0]; // English

// GET MORE COUNTRY FLAGS
// https://icon-sets.iconify.design/flagpack/
// https://www.dropbox.com/sh/nec1vwswr9lqbh9/AAB9ufC8iccxvtWi3rzZvndLa?dl=0
