# retext-indefinite-article

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**[retext][]** plugin to check indefinite articles.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(retextIndefiniteArticle)`](#unifieduseretextindefinitearticle)
*   [Messages](#messages)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a [unified][] ([retext][]) plugin to check indefinite articles
(`a` and `an`).
It’s more complex than checking vowels, as it has to do with sounds.
Knows about how digits are pronounced as well.

## When should I use this?

You can opt-into this plugin when you’re dealing with content that might contain
grammar mistakes, and have authors that can fix that content.

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, 16.0+, or 18.0+), install with [npm][]:

```sh
npm install retext-indefinite-article
```

In Deno with [`esm.sh`][esmsh]:

```js
import retextIndefiniteArticle from 'https://esm.sh/retext-indefinite-article@4'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import retextIndefiniteArticle from 'https://esm.sh/retext-indefinite-article@4?bundle'
</script>
```

## Use

Say our document `example.txt` contains:

```txt
He should, a 8-year old boy, should have arrived a hour
ago on an European flight.  An historic event, or a
historic event? Both are fine.
```

…and our module `example.js` looks as follows:

```js
import {read} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {unified} from 'unified'
import retextEnglish from 'retext-english'
import retextIndefiniteArticle from 'retext-indefinite-article'
import retextStringify from 'retext-stringify'

const file = await unified()
  .use(retextEnglish)
  .use(retextIndefiniteArticle)
  .use(retextStringify)
  .process(await read('example.txt'))

console.error(reporter(file))
```

…now running `node example.js` yields:

```txt
example.txt
  1:12-1:13  warning  Use `an` before `8-year`, not `a`    retext-indefinite-article  retext-indefinite-article
  1:50-1:51  warning  Use `an` before `hour`, not `a`      retext-indefinite-article  retext-indefinite-article
   2:8-2:10  warning  Use `a` before `European`, not `an`  retext-indefinite-article  retext-indefinite-article

⚠ 3 warnings
```

## API

This package exports no identifiers.
The default export is `retextIndefiniteArticle`.

### `unified().use(retextIndefiniteArticle)`

Check indefinite articles.

There are no options.

## Messages

Each message is emitted as a [`VFileMessage`][vfile-message] on `file`, with
the following fields:

###### `message.source`

Name of this plugin (`'retext-indefinite-article'`).

###### `message.ruleId`

Name of this plugin (`'retext-indefinite-article'`).

###### `message.actual`

Current not ok word (`string`, `'a'` or `'an'`).

###### `message.expected`

Array with one value (`Array<string>`, containing either `'a'` or `'an'`).

## Types

This package is fully typed with [TypeScript][].
It exports no additional types.

## Compatibility

Projects maintained by the unified collective are compatible with all maintained
versions of Node.js.
As of now, that is Node.js 12.20+, 14.14+, 16.0+, and 18.0+.
Our projects sometimes work with older versions, but this is not guaranteed.

## Related

*   [`retext-redundant-acronyms`](https://github.com/retextjs/retext-redundant-acronyms)
    — check for redundant acronyms (`ATM machine`)
*   [`retext-repeated-words`](https://github.com/retextjs/retext-repeated-words)
    — check `for for` repeated words

## Contribute

See [`contributing.md`][contributing] in [`retextjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/retextjs/retext-indefinite-article/workflows/main/badge.svg

[build]: https://github.com/retextjs/retext-indefinite-article/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/retextjs/retext-indefinite-article.svg

[coverage]: https://codecov.io/github/retextjs/retext-indefinite-article

[downloads-badge]: https://img.shields.io/npm/dm/retext-indefinite-article.svg

[downloads]: https://www.npmjs.com/package/retext-indefinite-article

[size-badge]: https://img.shields.io/bundlephobia/minzip/retext-indefinite-article.svg

[size]: https://bundlephobia.com/result?p=retext-indefinite-article

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/retextjs/retext/discussions

[npm]: https://docs.npmjs.com/cli/install

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[typescript]: https://www.typescriptlang.org

[health]: https://github.com/retextjs/.github

[contributing]: https://github.com/retextjs/.github/blob/main/contributing.md

[support]: https://github.com/retextjs/.github/blob/main/support.md

[coc]: https://github.com/retextjs/.github/blob/main/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[unified]: https://github.com/unifiedjs/unified

[retext]: https://github.com/retextjs/retext

[vfile-message]: https://github.com/vfile/vfile-message
