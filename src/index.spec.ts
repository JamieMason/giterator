import { expect, it } from 'vitest';
import type { Giterator } from './index.js';
import { giterator } from './index.js';

it('yields an object with all data for each commit as an async generator', async () => {
  for await (const commit of giterator('.')) {
    expect(commit).toEqual({
      authorDate: expect.any(String),
      authorDateRelative: expect.any(String),
      authorEmail: expect.any(String),
      authorName: expect.any(String),
      body: expect.any(String),
      commitHash: expect.any(String),
      commitNotes: expect.any(String),
      committerDate: expect.any(String),
      committerDateRelative: expect.any(String),
      committerEmail: expect.any(String),
      committerName: expect.any(String),
      parentHashes: expect.any(String),
      refNames: expect.any(String),
      reflogIdentityEmail: expect.any(String),
      reflogIdentityName: expect.any(String),
      reflogSelector: expect.any(String),
      reflogSubject: expect.any(String),
      sanitizedSubjectLine: expect.any(String),
      subject: expect.any(String),
      treeHash: expect.any(String),
    });
    break;
  }
});

it('yields a smaller subset of data when tokenNames are specified', async () => {
  for await (const commit of giterator('.', {
    tokenNames: ['commitHash', 'subject'],
  })) {
    expect(commit).toEqual({
      commitHash: expect.any(String),
      subject: expect.any(String),
    });
    break;
  }
});

it('uses custom spawn function when provided', async () => {
  let spawnWasCalled = false;
  const customSpawn: Giterator.Options['spawn'] = () => {
    spawnWasCalled = true;
    const EventEmitter = require('node:events');
    const emitter = new EventEmitter.EventEmitter();
    setTimeout(() => emitter.emit('close'), 0);
    emitter.stdout = null;
    emitter.stderr = null;
    return emitter;
  };

  for await (const _commit of giterator('.', {
    tokenNames: ['commitHash'],
    spawn: customSpawn,
  })) {
    break;
  }

  expect(spawnWasCalled).toBe(true);
});
