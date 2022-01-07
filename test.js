import test from 'tape'
import {retext} from 'retext'
import chalk from 'chalk'
import indefiniteArticle from './index.js'

const proc = retext().use(indefiniteArticle)

test('indefiniteArticle()', (t) => {
  const good = [
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
    'a unist tree',
    'an mdast tree',

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
    'an h1',
    'an h6',
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
    'a "bicycle"',
    'a unicycle'
  ]

  const bad = [
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
    'a h1',
    'a h6',
    'asked an UN member',
    'In a un-united Germany',
    'Anyone for a MSc?',
    'They form an union and get laws passed.',
    'an unicycle'
  ]

  t.plan(good.length + bad.length + 1)

  proc
    .process(
      [
        'He should have arrived a hour ago on an European flight.',
        'an historic event, or a historic event?'
      ].join('\n')
    )
    .then((file) => {
      t.deepEqual(
        file.messages.map((d) => String(d)),
        [
          '1:24-1:25: Use `an` before `hour`, not `a`',
          '1:38-1:40: Use `a` before `European`, not `an`'
        ],
        'should catch indefinite articles'
      )
    }, t.ifErr)

  let index = -1

  while (++index < good.length) {
    const fixture = good[index]
    proc.process(fixture).then((file) => {
      t.deepEqual(
        file.messages.map((d) => String(d)),
        [],
        highlight(fixture)
      )
    }, t.ifErr)
  }

  index = -1
  while (++index < bad.length) {
    const fixture = bad[index]
    proc.process(fixture).then((file) => {
      t.equal(file.messages.length, 1, highlight(fixture))
    }, t.ifErr)
  }
})

/**
 * @param {string} name
 * @returns {name}
 */
function highlight(name) {
  return name.replace(/\ban?\b/gi, ($0) => chalk.bold($0))
}
