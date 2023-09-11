/**
 * @typedef {import('nlcst').Root} Root
 * @typedef {import('nlcst').Sentence} Sentence
 * @typedef {import('nlcst').Word} Word
 *
 * @typedef {import('vfile').VFile} VFile
 */

/**
 * @typedef {'a' | 'a-or-an' | 'an'} Type
 *   Type.
 */

import {toString} from 'nlcst-to-string'
import numberToWords from 'number-to-words'
import {visit} from 'unist-util-visit'
import {a} from './a.js'
import {an} from './an.js'

const needsA = createCheck(a)
const needsAn = createCheck(an)

/**
 * Check `a` and `an`.
 *
 * @returns
 *   Transform.
 */
export default function retextIndefiniteArticle() {
  /**
   * Transform.
   *
   * @param {Root} tree
   *   Tree.
   * @param {VFile} file
   *   File.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree, file) {
    visit(tree, 'WordNode', function (node, index, parent) {
      const actual = toString(node)
      const normal = actual.toLowerCase()

      if (
        (normal !== 'a' && normal !== 'an') ||
        !parent ||
        index === undefined
      ) {
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
      if (normal === actual && !an && /^(and|nor|or)$/i.test(following)) {
        return
      }

      /** @type {string | undefined} */
      let expected = classify(following)

      if (!(expected === 'an' && !an) && !(expected === 'a' && an)) {
        return
      }

      if (normal !== actual) {
        expected = expected.charAt(0).toUpperCase() + expected.slice(1)
      }

      const message = file.message(
        'Unexpected article `' +
          actual +
          '` before `' +
          following +
          '`, expected `' +
          expected +
          '`',
        {
          ancestors: [parent, node],
          place: node.position,
          ruleId: 'retext-indefinite-article',
          source: 'retext-indefinite-article'
        }
      )

      message.actual = actual
      message.expected = [expected]
      message.url =
        'https://github.com/retextjs/retext-indefinite-article#readme'
    })
  }
}

/**
 * Check if there’s no word before `index`.
 *
 * @param {Root | Sentence} parent
 *   Node.
 * @param {number} index
 *   Index.
 * @returns {boolean}
 *   Whether there is no word before `index`.
 */
function firstWord(parent, index) {
  const siblings = parent.children

  while (index--) {
    if (siblings[index].type === 'WordNode') {
      return false
    }
  }

  return true
}

/**
 * Get the next word.
 *
 * @param {Root | Sentence} parent
 *   Node.
 * @param {number} index
 *   Index.
 * @returns {Word | undefined}
 *   Next word.
 */
function after(parent, index) {
  const siblings = parent.children
  let sibling = siblings[++index]
  /** @type {Word | undefined} */
  let other

  if (sibling && sibling.type === 'WhiteSpaceNode') {
    sibling = siblings[++index]

    if (
      sibling &&
      sibling.type === 'PunctuationNode' &&
      /^[“”‘’'"()[\]]$/.test(toString(sibling))
    ) {
      sibling = siblings[++index]
    }

    if (sibling && sibling.type === 'WordNode') {
      other = sibling
    }
  }

  return other
}

/**
 * Classify a word.
 *
 * @param {string} value
 *   Word to classify.
 * @returns {Type | undefined}
 *   Type.
 */
function classify(value) {
  const head = value
    .replace(/^\d+/, function (value) {
      return numberToWords.toWords(value) + ' '
    })
    .split(/['’ -]/, 1)[0]
  const a = needsA(head)
  const an = needsAn(head)

  return a && an
    ? 'a-or-an'
    : a
    ? 'a'
    : an
    ? 'an'
    : head.toLowerCase() === head
    ? /[aeiou]/.test(head.charAt(0).toLowerCase())
      ? 'an'
      : 'a'
    : undefined
}

/**
 * Create a test based on a list of phrases.
 *
 * @param {ReadonlyArray<string>} list
 *   List of phrases.
 * @returns
 *   Check.
 */
function createCheck(list) {
  /** @type {Set<RegExp>} */
  const expressions = new Set()
  /** @type {Set<string>} */
  const sensitive = new Set()
  /** @type {Set<string>} */
  const insensitive = new Set()
  let index = -1

  while (++index < list.length) {
    const value = list[index]

    if (value.charAt(value.length - 1) === '*') {
      // Regexes are insensitive now, once we need them this should check for
      // `normal` as well.
      expressions.add(new RegExp('^' + value.slice(0, -1), 'i'))
    } else if (value === value.toLowerCase()) {
      insensitive.add(value)
    } else {
      sensitive.add(value)
    }
  }

  return check

  /**
   * Check.
   *
   * @param {string} value
   *   Value to check.
   * @returns {boolean}
   *   Whether `value` is in `list`.
   */
  function check(value) {
    if (sensitive.has(value) || insensitive.has(value.toLowerCase())) {
      return true
    }

    for (const expression of expressions) {
      if (expression.test(value)) {
        return true
      }
    }

    return false
  }
}
