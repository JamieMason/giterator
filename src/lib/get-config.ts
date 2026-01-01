import { isBoolean, isNumber } from 'expect-more';
import type { Giterator } from '../index.js';
import { tokensByName } from './tokens-by-name.js';

export function getConfig(
  options: Partial<Giterator.Options>,
): Giterator.Options {
  const o = options;
  return {
    tokenNames: o.tokenNames || getAllTokenNames(),
    pageSize: isNumber(o.pageSize) ? o.pageSize : 20,
    skipMerges: isBoolean(o.skipMerges) ? o.skipMerges : true,
  };

  function getAllTokenNames() {
    return Object.keys(tokensByName) as Giterator.TokenName[];
  }
}
