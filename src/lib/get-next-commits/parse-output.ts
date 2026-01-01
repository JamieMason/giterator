import type { Giterator } from '../../index.js';
import { parseLine } from './parse-line.js';

export function parseOutput(
  output: string,
  tokenNames: Giterator.TokenName[],
): Giterator.Commit[] {
  return output
    .split(/\n?<commit>|<\/commit>\n?/g)
    .filter(Boolean)
    .map((line) =>
      tokenNames.reduce<Giterator.Commit>((commit, tokenName) => {
        commit[tokenName] = parseLine(tokenName, line);
        return commit;
      }, {}),
    );
}
