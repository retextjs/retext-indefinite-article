import format from 'format'
import {visit} from 'unist-util-visit'
import {convert} from 'unist-util-is'
import {toString} from 'nlcst-to-string'
import numberToWords from 'number-to-words'
import {a} from './a.js'
import {an} from './an.js'

const ruleId = 'retext-indefinite-article:retext-indefinite-article'

const word = convert('WordNode')
const whiteSpace = convert('WhiteSpaceNode')
const punctuation = convert('PunctuationNode')

const needsA = factory(a)
const needsAn = factory(an)

export default function retextIndefiniteArticle() {
  return (tree, file) => {
    visit(tree, 'WordNode', (node, index, parent) => {
      const actual = toString(node)
      const normal = actual.toLowerCase()

      if (normal !== 'a' && normal !== 'an') {
        return
      }

      const next = after(parent, index)

      if (!next) {
        return
      }

      const an = actual.length !== 1
      const following = toString(next)

      // Exit if `A` and this isn’t sentence-start: `Station A equals`
      if (normal !== actual && !an && !firstWord(parent, index)) {
        return
      }

      // Exit if `a` is used as a letter: `a and b`.
      if (normal === actual && !an && /^(and|or|nor)$/i.test(following)) {
        return
      }

      let expected = classify(following)

      if (!(expected === 'an' && !an) && !(expected === 'a' && an)) {
        return
      }

      if (normal !== actual) {
        expected = expected.charAt(0).toUpperCase() + expected.slice(1)
      }

      Object.assign(
        file.message(
          format('Use `%s` before `%s`, not `%s`', expected, following, actual),
          node,
          ruleId
        ),
        {actual, expected: [expected]}
      )
    })
  }
}

// Check if there’s no word before `index`.
function firstWord(parent, index) {
  const siblings = parent.children

  while (index--) {
    if (word(siblings[index])) {
      return false
    }
  }

  return true
}

// Get the next word.
function after(parent, index) {
  const siblings = parent.children
  let sibling = siblings[++index]
  let other

  if (whiteSpace(sibling)) {
    sibling = siblings[++index]

    if (punctuation(sibling) && /^[“”‘’'"()[\]]$/.test(toString(sibling))) {
      sibling = siblings[++index]
    }

    if (word(sibling)) {
      other = sibling
    }
  }

  return other
}

// Classify a word.
function classify(value) {
  const head = value
    .replace(/^\d+/, (value) => numberToWords.toWords(value) + ' ')
    .split(/['’ -]/, 1)[0]
  const normal = head.toLowerCase()
  let type

  if (needsA(head)) {
    type = 'a'
  }

  if (needsAn(head)) {
    type = type === 'a' ? 'a-or-an' : 'an'
  }

  if (!type && normal === head) {
    type = /[aeiou]/.test(normal.charAt(0)) ? 'an' : 'a'
  }

  return type
}

// Create a test based on a list of phrases.
function factory(list) {
  const expressions = []
  const sensitive = []
  const insensitive = []
  let index = -1

  while (++index < list.length) {
    const value = list[index]

    if (value.charAt(value.length - 1) === '*') {
      // Regexes are insensitive now, once we need them this should check for
      // `normal` as well.
      expressions.push(new RegExp('^' + value.slice(0, -1), 'i'))
    } else if (value === value.toLowerCase()) {
      insensitive.push(value)
    } else {
      sensitive.push(value)
    }
  }

  return test

  function test(value) {
    const normal = value.toLowerCase()

    if (sensitive.includes(value) || insensitive.includes(normal)) {
      return true
    }

    let index = -1

    while (++index < expressions.length) {
      if (expressions[index].test(value)) {
        return true
      }
    }

    return false
  }
}
