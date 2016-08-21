# retext-indefinite-article [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Check if indefinite articles (`a` and `an`) are used correctly with
[**retext**][retext].

## Installation

[npm][npm-install]:

```bash
npm install retext-indefinite-article
```

## Usage

```js
var retext = require('retext');
var english = require('retext-english');
var indefiniteArticle = require('retext-indefinite-article');
var report = require('vfile-reporter');

retext().use(english).use(indefiniteArticle).process([
  'He should, a 8-year old boy, should have arrived a hour',
  'ago on an European flight.  An historic event, or a',
  'historic event? Both are fine.'
].join('\n'), function (err, file) {
  console.log(report(err || file));
});
```

Yields:

```txt
  1:12-1:13  warning  Use `an` before `8-year`, not `a`    retext-indefinite-article
  1:50-1:51  warning  Use `an` before `hour`, not `a`      retext-indefinite-article
   2:8-2:10  warning  Use `a` before `European`, not `an`  retext-indefinite-article

⚠ 3 warnings
```

## API

### `retext().use(indefiniteArticle)`

Check if indefinite articles (`a` and `an`) are used correctly (which isn’t
as simple as checking vowels as it has to do with sounds).  Knows about
how digits are pronounced as well.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/wooorm/retext-indefinite-article.svg

[travis]: https://travis-ci.org/wooorm/retext-indefinite-article

[codecov-badge]: https://img.shields.io/codecov/c/github/wooorm/retext-indefinite-article.svg

[codecov]: https://codecov.io/github/wooorm/retext-indefinite-article

[npm-install]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[retext]: https://github.com/wooorm/retext
