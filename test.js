import assert from 'node:assert/strict'
import test from 'node:test'
import chalk from 'chalk'
import {retext} from 'retext'
import retextIndefiniteArticle from './index.js'

test('retextIndefiniteArticle', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('./index.js')).sort(), [
      'default'
    ])
  })

  await t.test('should catch indefinite articles', async function () {
    const file = await retext()
      .use(retextIndefiniteArticle)
      .process(
        [
          'He should have arrived a hour ago on an European flight.',
          'an historic event, or a historic event?'
        ].join('\n')
      )

    assert.deepEqual(file.messages.map(String), [
      '1:24-1:25: Use `an` before `hour`, not `a`',
      '1:38-1:40: Use `a` before `European`, not `an`'
    ])
  })

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

  let index = -1

  while (++index < good.length) {
    const value = good[index]

    await t.test(
      'should work on good `' + highlight(value) + '`',
      async function () {
        const file = await retext().use(retextIndefiniteArticle).process(value)
        assert.deepEqual(file.messages.map(String), [])
      }
    )
  }

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
    'an unicycle',
    'an URL'
  ]

  index = -1

  while (++index < bad.length) {
    const value = bad[index]

    await t.test(
      'should work on bad `' + highlight(value) + '`',
      async function () {
        const file = await retext().use(retextIndefiniteArticle).process(value)
        assert.equal(file.messages.length, 1)
      }
    )
  }
})

/**
 * @param {string} name
 *   Value.
 * @returns {name}
 *   Value with indefinite articles highlighted.
 */
function highlight(name) {
  return name.replace(/\ban?\b/gi, function ($0) {
    return chalk.bold($0)
  })
}
