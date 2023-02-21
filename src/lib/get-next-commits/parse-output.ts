import type { Giterator } from '../..';
import { parseLine } from './parse-line';

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
