import { isBoolean } from 'expect-more/dist/is-boolean';
import { isNumber } from 'expect-more/dist/is-number';
import type { Giterator } from '..';
import { tokensByName } from './tokens-by-name';

export function getConfig(options: Partial<Giterator.Options>) {
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
