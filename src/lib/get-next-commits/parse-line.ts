import type { Giterator } from '../..';

export function parseLine(tokenName: Giterator.TokenName, line: string) {
  const openTag = `<${tokenName}>`;
  const startIndex = line.indexOf(openTag) + openTag.length;
  const closeTag = `</${tokenName}>`;
  const endIndex = line.indexOf(closeTag);
  return line.substring(startIndex, endIndex).trim();
}
