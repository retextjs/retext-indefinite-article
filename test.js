'use strict'

var test = require('tape')
var retext = require('retext')
var chalk = require('chalk')
var indefiniteArticle = require('.')

var proc = retext().use(indefiniteArticle)

test('indefiniteArticle()', function (t) {
  proc.process(
    [
      'He should have arrived a hour ago on an European flight.',
      'an historic event, or a historic event?'
    ].join('\n'),
    function (error, file) {
      t.deepEqual(
        [error].concat(file.messages.map(String)),
        [
          null,
          '1:24-1:25: Use `an` before `hour`, not `a`',
          '1:38-1:40: Use `a` before `European`, not `an`'
        ],
        'should catch indefinite articles'
      )
    }
  )

  var good = [
    // https://en.wikipedia.org/wiki/Article_(grammar)#Indefinite_article
    'She had a house so large that an elephant would get lost without a map',
    'a European',
    'a hallucination',
    'an hallucination',
    'a hilarious',
    'an hilarious',
    'a historic',
    'an historic',
    'a historical',
    'an historical',
    'a horrendous',
    'an horrendous',
    'a horrific',
    'an horrific',
    'a hotel',
    'an hotel',
    'a herb',
    'an herb',
    'a hereditary',
    'an hereditary',

    'This is a test sentence',
    'It was an hour ago',
    'A unidirectional flow',
    'A unified thing',
    'A university is',
    'A one-way street',
    'An hour’s work',
    'Going to an “industry party”',
    'An 8-year old boy',
    'An 18-year old boy',
    'a 1px border',
    'a 100m sprint',
    'a 1rem font size',
    'a 1/4" hole',
    'a 1-off thing',
    'a 1x increase',
    'a 1:1 correspondence',
    'a 1:00 train',
    'a 1.0 release',
    'The A-levels are',
    'An NOP check',
    'A USA-wide license',
    'asked a UN member',
    'In an un-united Germany',
    'Here, a and b are supplementary angles',
    'Station A equals station B',
    'A University',
    'a unique identifier',
    'A Europe wide thing',
    'an npm package',
    'A. R.J. Turgot',
    'an MSc',
    'an XMR-based',
    "plural A’s, A's, As, as, or a’s, a's.",
    'They form a union and get laws passed.',
    // Don’t fail without words.
    'Station N equals station A',
    'Station N equals station A.',
    'a.',
    'an.',
    'a "',
    'a (',
    // Punctuation.
    'an “hour',
    'a "bicycle"'
  ]

  var bad = [
    'was a hour ago',
    'was an sentence',
    'An unidirectional flow',
    'was a uninteresting',
    'An university',
    'A uninteresting',
    'A hour’s work',
    'to a “industry party”',
    '"It was a uninteresting talk"',
    'then an University',
    'A 8-year old',
    'A 18-year old',
    'An 1/4" hole',
    'An 1-off thing',
    'an 1:1 correspondence',
    'an 1:00 train',
    'asked an UN member',
    'In a un-united Germany',
    'Anyone for a MSc?',
    'They form an union and get laws passed.'
  ]

  good.forEach(function (fixture) {
    proc.process(fixture, function (error, file) {
      t.deepEqual(
        [error].concat(file.messages.map(String)),
        [null],
        highlight(fixture)
      )
    })
  })

  bad.forEach(function (fixture) {
    proc.process(fixture, function (error, file) {
      t.deepEqual([error, file.messages.length], [null, 1], highlight(fixture))
    })
  })

  t.end()
})

function highlight(name) {
  return name.replace(/\ban?\b/gi, bold)
}

function bold($0) {
  return chalk.bold($0)
}
