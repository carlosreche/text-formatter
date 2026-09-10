/**
 * formatText function
 * Copyright (C) 2026 Carlos Henrique Reche <carlosreche@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://gnu.org>.
 */
export default function formatText(text, options = {}) {
  if (typeof text !== 'string') {
    throw new TypeError(`Text.format expects a string as the first argument. Given: ${typeof text}`);
  }

  let {
    mode = 'normal',
    trimEdges = true,
    normalizeSpaces = true,
    removeNewlines = false,
    lowercaseWords = null,
    language = null
  } = Object(options);

  let formatted = text;

  if (trimEdges) {
    formatted = formatted.trim();
  }
  if (removeNewlines) {
    formatted = formatted.replace(/[\r\n]+/g, ' ');
  }
  if (normalizeSpaces) {
    formatted = formatted.replace(/(\s)\s+/g, '$1');
  }

  mode = String(mode).trim().toLowerCase();
  switch (mode) {
    case 'normal':
    case 'regular':
      return formatted
              .toLowerCase()
              .replace(
                /((^)[^\p{L}]*|[^\p{L}]+)((\p{L})((\p{L}|-\p{L})*))/gu,
                (all, before, beggining, word, firstLetter, remaining) => {
                  if ((beggining !== undefined) || /[.!?¡¿]\s*$/.test(before)) {
                    return (before + firstLetter.toUpperCase() + remaining);
                  }
                  return all;
                }
              );

    case 'upper':
      return formatted.toUpperCase();

    case 'lower':
      return formatted.toLowerCase();

    case 'first':
      return formatted
              .toLowerCase()
              .replace(
                /^([^\p{L}]*)(\p{L})/u,
                (all, before, firstLetter) => (before + firstLetter.toUpperCase())
              );

    case 'capitalize':
      return formatted
              .toLowerCase()
              .replace(
                /(^|[^\p{L}]+)((\p{L})((\p{L}|-\p{L})*))/gu,
                (all, before, word, firstLetter, remaining) =>
                                    (before + firstLetter.toUpperCase() + remaining)
              );

    case 'proper':
      let isLowercaseWord;
      if (typeof lowercaseWords === 'string') {
        isLowercaseWord = word => (word === lowercaseWords);
      } else if (lowercaseWords instanceof RegExp) {
        isLowercaseWord = word => lowercaseWords.test(word);
      } else {
        if (!Array.isArray(lowercaseWords)) {
          language = ((typeof language === 'string') ? language : navigator?.language)?.trim().toLowerCase().split('-')[0];
          switch (language) {
            case 'pt':
              lowercaseWords = ['o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas', 'de', 'em', 'por', 'com', 'para', 'sob', 'sobre', 'até', 'sem', 'do', 'da', 'dos', 'das', 'no', 'na', 'nos', 'nas', 'pelo', 'pela', 'pelos', 'pelas', 'ao', 'aos', 'e', 'nem', 'mas', 'porém', 'contudo', 'todavia', 'entretanto', 'ou', 'logo', 'pois', 'portanto', 'porque', 'que'];
              break;
            case 'en':
              lowercaseWords = ['of', 'and', 'the', 'in', 'to', 'for', 'with', 'on', 'at', 'by', 'from', 'a', 'an', 'or', 'but'];
              break;
            case 'es':
            case 'spa':
              lowercaseWords = ['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'lo', 'del', 'al', 'a', 'ante', 'bajo', 'con', 'contra', 'de', 'desde', 'durante', 'en', 'entre', 'hacia', 'hasta', 'mediante', 'para', 'por', 'según', 'sin', 'sobre', 'tras', 'vía', 'y', 'e', 'o', 'u', 'pero', 'sino', 'porque', 'aunque', 'si', 'ni'];
              break;
            default:
              lowercaseWords = [];
          }
        }
        isLowercaseWord = word => lowercaseWords.some(lcWord => {
          if (typeof lcWord === 'string') return (word === lcWord);
          if (lcWord instanceof RegExp) return lcWord.test(word);
          return false;
        });
      }

      return formatted
              .toLowerCase()
              .replace(
                /((^)[^\p{L}]*|[^\p{L}]+)((\p{L})((\p{L}|-\p{L})*))/gu,
                (all, before, beggining, word, firstLetter, remaining) => {
                  if (isLowercaseWord(word) && !/[.!?¡¿]\s*$/.test(before) && (beggining === undefined)) {
                    return all;
                  }
                  return (before + firstLetter.toUpperCase() + remaining);
                }
              );

    default:
      return formatted;
  }
};
