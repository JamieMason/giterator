export const tokensByName = {
  authorDate: '%aI',
  authorDateRelative: '%ar',
  authorEmail: '%aE',
  authorName: '%aN',
  body: '%b',
  commitHash: '%H',
  commitNotes: '%N',
  committerDate: '%cI',
  committerDateRelative: '%cr',
  committerEmail: '%cE',
  committerName: '%cN',
  parentHashes: '%P',
  reflogIdentityEmail: '%gE',
  reflogIdentityName: '%gN',
  reflogSelector: '%gD',
  reflogSubject: '%gs',
  /**
   * @example "tag: 4.0.0"
   * @example "origin/dev"
   * @example "HEAD -> master, tag: 9.8.4, origin/master, origin/HEAD"
   */
  refNames: '%D',
  sanitizedSubjectLine: '%f',
  subject: '%s',
  treeHash: '%T',
} as const;
