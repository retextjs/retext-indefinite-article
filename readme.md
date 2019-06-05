# retext-indefinite-article

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**retext**][retext] plugin to check if indefinite articles (`a` and `an`) are
used correctly.

## Install

[npm][]:

```sh
npm install retext-indefinite-article
```

## Use

Say we have the following file, `example.txt`:

```txt
He should, a 8-year old boy, should have arrived a hour
ago on an European flight.  An historic event, or a
historic event? Both are fine.
```

…and our script, `example.js`, looks like this:

```js
var vfile = require('to-vfile')
var report = require('vfile-reporter')
var unified = require('unified')
var english = require('retext-english')
var stringify = require('retext-stringify')
var indefiniteArticle = require('retext-indefinite-article')

unified()
  .use(english)
  .use(indefiniteArticle)
  .use(stringify)
  .process(vfile.readSync('example.txt'), function(err, file) {
    console.error(report(err || file))
  })
```

Now, running `node example` yields:

```txt
example.txt
  1:12-1:13  warning  Use `an` before `8-year`, not `a`    retext-indefinite-article  retext-indefinite-article
  1:50-1:51  warning  Use `an` before `hour`, not `a`      retext-indefinite-article  retext-indefinite-article
   2:8-2:10  warning  Use `a` before `European`, not `an`  retext-indefinite-article  retext-indefinite-article

⚠ 3 warnings
```

## API

### `retext().use(indefiniteArticle)`

Check if indefinite articles (`a` and `an`) are used correctly (which isn’t as
simple as checking vowels as it has to do with sounds).
Knows about how digits are pronounced as well.

## Related

*   [`retext-redundant-acronyms`](https://github.com/retextjs/retext-redundant-acronyms)
    — Check for redundant acronyms (`ATM machine`)
*   [`retext-repeated-words`](https://github.com/retextjs/retext-repeated-words)
    — Check `for for` repeated words

## Contribute

See [`contributing.md`][contributing] in [`retextjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [Code of Conduct][coc].
By interacting with this repository, organisation, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/retextjs/retext-indefinite-article.svg

[build]: https://travis-ci.org/retextjs/retext-indefinite-article

[coverage-badge]: https://img.shields.io/codecov/c/github/retextjs/retext-indefinite-article.svg

[coverage]: https://codecov.io/github/retextjs/retext-indefinite-article

[downloads-badge]: https://img.shields.io/npm/dm/retext-indefinite-article.svg

[downloads]: https://www.npmjs.com/package/retext-indefinite-article

[size-badge]: https://img.shields.io/bundlephobia/minzip/retext-indefinite-article.svg

[size]: https://bundlephobia.com/result?p=retext-indefinite-article

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/retext

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/retextjs/.github

[contributing]: https://github.com/retextjs/.github/blob/master/contributing.md

[support]: https://github.com/retextjs/.github/blob/master/support.md

[coc]: https://github.com/retextjs/.github/blob/master/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[retext]: https://github.com/retextjs/retext
