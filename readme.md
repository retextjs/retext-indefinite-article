# retext-indefinite-article [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Check if indefinite articles (`a` and `an`) are used correctly with
[**retext**][retext].

## Installation

[npm][npm-install]:

```bash
npm install retext-indefinite-article
```

## Usage

Say we have the following file, `example.txt`:

```text
He should, a 8-year old boy, should have arrived a hour
ago on an European flight.  An historic event, or a
historic event? Both are fine.
```

And our script, `example.js`, looks like this:

```javascript
var vfile = require('to-vfile');
var report = require('vfile-reporter');
var unified = require('unified');
var english = require('retext-english');
var stringify = require('retext-stringify');
var indefiniteArticle = require('retext-indefinite-article');

unified()
  .use(english)
  .use(indefiniteArticle)
  .use(stringify)
  .process(vfile.readSync('example.txt'), function (err, file) {
    console.error(report(err || file));
  });
```

Now, running `node example` yields:

```text
example.txt
  1:12-1:13  warning  Use `an` before `8-year`, not `a`    retext-indefinite-article  retext-indefinite-article
  1:50-1:51  warning  Use `an` before `hour`, not `a`      retext-indefinite-article  retext-indefinite-article
   2:8-2:10  warning  Use `a` before `European`, not `an`  retext-indefinite-article  retext-indefinite-article

⚠ 3 warnings
```

## API

### `retext().use(indefiniteArticle)`

Check if indefinite articles (`a` and `an`) are used correctly (which isn’t
as simple as checking vowels as it has to do with sounds).  Knows about
how digits are pronounced as well.

## Related

*   [`retext-redundant-acronyms`](https://github.com/retextjs/retext-redundant-acronyms)
    — Check for redundant acronyms (`ATM machine`)
*   [`retext-repeated-words`](https://github.com/retextjs/retext-repeated-words)
    — Check `for for` repeated words

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/retextjs/retext-indefinite-article.svg

[travis]: https://travis-ci.org/retextjs/retext-indefinite-article

[codecov-badge]: https://img.shields.io/codecov/c/github/retextjs/retext-indefinite-article.svg

[codecov]: https://codecov.io/github/retextjs/retext-indefinite-article

[npm-install]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[retext]: https://github.com/retextjs/retext
