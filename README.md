# giterator

> `git log` as a JavaScript generator

## Installation

```
npm install --save giterator
```

## Usage

```js
import { giterator } from 'giterator';

for await (const commit of giterator('/Users/foldleft/Dev/syncpack', {
  pageSize: 20,
  skipMerges: true,
  tokenNames: ['authorName', 'subject', 'refNames'],
})) {
  console.log(commit);
}
```

Our example would produce;

```
{
  authorName: 'Jamie Mason',
  subject: 'chore(license): update year',
  refNames: 'HEAD -> master, origin/master, origin/HEAD'
}
{
  authorName: 'Jamie Mason',
  subject: 'chore(release): 9.8.4',
  refNames: 'tag: 9.8.4'
}
{
  authorName: 'Jamie Mason',
  subject: 'docs(site): mark up required/optional config',
  refNames: 'origin/dev, dev'
}
{
  authorName: 'Jamie Mason',
  subject: 'feat(semver): support resolving with lowest version',
  refNames: ''
}
// ...etc
```

## Options

### `directory` string

Absolute path to your locally cloned git repository.

### `options.tokenNames` string[]

Optional array of strings representing the data required from each git commit
(defaults to all).

- authorDate
- authorDateRelative
- authorEmail
- authorName
- body
- commitHash
- commitNotes
- committerDate
- committerDateRelative
- committerEmail
- committerName
- parentHashes
- reflogIdentityEmail
- reflogIdentityName
- reflogSelector
- reflogSubject
- refNames
- sanitizedSubjectLine
- subject
- treeHash

For more information see the
[Git Pretty Formats Documentation](https://git-scm.com/docs/pretty-formats).

### `options.skipMerges` boolean

Whether to exclude merge commits from being returned (defaults to true).

## Badges

- [![NPM version](http://img.shields.io/npm/v/giterator.svg?style=flat-square)](https://www.npmjs.com/package/giterator)
- [![NPM downloads](http://img.shields.io/npm/dm/giterator.svg?style=flat-square)](https://www.npmjs.com/package/giterator)
