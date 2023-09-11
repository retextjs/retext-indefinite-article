# retext-indefinite-article

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**[retext][]** plugin to check `a` and `an`.

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
This package knows about how digits are pronounced as well.

## When should I use this?

You can use this plugin when you’re dealing with content that might contain
grammar mistakes, and have authors that can fix that content.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install retext-indefinite-article
```

In Deno with [`esm.sh`][esmsh]:

```js
import retextIndefiniteArticle from 'https://esm.sh/retext-indefinite-article@5'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import retextIndefiniteArticle from 'https://esm.sh/retext-indefinite-article@5?bundle'
</script>
```

## Use

Say our document `example.txt` contains:

```txt
He should, a 8-year old boy, should have arrived a hour
ago on an European flight.
An historic event, or a historic event? Both are fine.
```

…and our module `example.js` contains:

```js
import retextEnglish from 'retext-english'
import retextIndefiniteArticle from 'retext-indefinite-article'
import retextStringify from 'retext-stringify'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

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
1:12-1:13 warning Unexpected article `a` before `8-year`, expected `an`   retext-indefinite-article retext-indefinite-article
1:50-1:51 warning Unexpected article `a` before `hour`, expected `an`     retext-indefinite-article retext-indefinite-article
2:8-2:10  warning Unexpected article `an` before `European`, expected `a` retext-indefinite-article retext-indefinite-article

⚠ 3 warnings
```

## API

This package exports no identifiers.
The default export is
[`retextIndefiniteArticle`][api-retext-indefinite-article].

### `unified().use(retextIndefiniteArticle)`

Check `a` and `an`.

###### Parameters

There are no parameters.

###### Returns

Transform ([`Transformer`][unified-transformer]).

## Messages

Each message is emitted as a [`VFileMessage`][vfile-message] on `file`, with
`source` set to `'retext-indefinite-article'`, `ruleId` to
`'retext-indefinite-article'`, `actual` to the unexpected word, and `expected`
to suggestions.

## Types

This package is fully typed with [TypeScript][].
It exports no additional types.

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`retext-indefinite-article@^5`, compatible with Node.js 16.

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

[size-badge]: https://img.shields.io/bundlejs/size/retext-indefinite-article

[size]: https://bundlejs.com/?q=retext-indefinite-article

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

[retext]: https://github.com/retextjs/retext

[unified]: https://github.com/unifiedjs/unified

[unified-transformer]: https://github.com/unifiedjs/unified#transformer

[vfile-message]: https://github.com/vfile/vfile-message

[api-retext-indefinite-article]: #unifieduseretextindefinitearticle
