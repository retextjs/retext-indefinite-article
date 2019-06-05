'use strict'

var format = require('format')
var visit = require('unist-util-visit')
var convert = require('unist-util-is/convert')
var toString = require('nlcst-to-string')
var toWords = require('number-to-words').toWords
var requiresA = require('./a')
var requiresAn = require('./an')

module.exports = indefiniteArticle

var ruleId = 'retext-indefinite-article:retext-indefinite-article'
var vowel = /[aeiou]/
var digits = /^\d+/
var join = /^(and|or|nor)$/i
var punctuationIgnore = /^[“”‘’'"()[\]]$/
var split = /['’ -]/

var word = convert('WordNode')
var whiteSpace = convert('WhiteSpaceNode')
var punctuation = convert('PunctuationNode')

var needsA = factory(requiresA)
var needsAn = factory(requiresAn)

function indefiniteArticle() {
  return transformer
}

function transformer(tree, file) {
  visit(tree, 'WordNode', visitor)

  function visitor(node, index, parent) {
    var value = toString(node)
    var normal = lower(value)
    var message
    var following
    var suggestion
    var an

    if (normal !== 'a' && normal !== 'an') {
      return
    }

    an = value.length !== 1
    following = after(parent, index)

    if (!following) {
      return
    }

    following = toString(following)

    // Exit if `A` and this isn’t sentence-start: `Station A equals`
    if (normal !== value && !an && !firstWord(parent, index)) {
      return
    }

    // Exit if `a` is used as a letter: `a and b`.
    if (normal === value && !an && join.test(following)) {
      return
    }

    suggestion = classify(following)

    if (!(suggestion === 'an' && !an) && !(suggestion === 'a' && an)) {
      return
    }

    if (normal !== value) {
      suggestion = suggestion.charAt(0).toUpperCase() + suggestion.slice(1)
    }

    message = file.message(
      format('Use `%s` before `%s`, not `%s`', suggestion, following, value),
      node,
      ruleId
    )

    message.actual = value
    message.expected = [suggestion]
  }
}

// Check if there’s no word before `index`.
function firstWord(parent, index) {
  var siblings = parent.children

  while (index--) {
    if (word(siblings[index])) {
      return false
    }
  }

  return true
}

// Get the next word.
function after(parent, index) {
  var siblings = parent.children
  var sibling = siblings[++index]
  var other

  if (whiteSpace(sibling)) {
    sibling = siblings[++index]

    if (punctuation(sibling) && punctuationIgnore.test(toString(sibling))) {
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
  var val = value.replace(digits, toWords).split(split, 1)[0]
  var normal = lower(val)
  var type = null

  if (needsA(val)) {
    type = 'a'
  }

  if (needsAn(val)) {
    type = type === 'a' ? 'a-or-an' : 'an'
  }

  if (!type && normal === val) {
    type = vowel.test(normal.charAt(0)) ? 'an' : 'a'
  }

  return type
}

// Create a test based on a list of phrases.
function factory(list) {
  var expressions = []
  var sensitive = []
  var insensitive = []

  construct()

  return test

  function construct() {
    var length = list.length
    var index = -1
    var value
    var normal

    while (++index < length) {
      value = list[index]
      normal = value === lower(value)

      if (value.charAt(value.length - 1) === '*') {
        // Regexes are insensitive now, once we need them this should check for
        // `normal` as well.
        expressions.push(new RegExp('^' + value.slice(0, -1), 'i'))
      } else if (normal) {
        insensitive.push(value)
      } else {
        sensitive.push(value)
      }
    }
  }

  function test(value) {
    var normal = lower(value)
    var length
    var index

    if (sensitive.indexOf(value) !== -1 || insensitive.indexOf(normal) !== -1) {
      return true
    }

    length = expressions.length
    index = -1

    while (++index < length) {
      if (expressions[index].test(value)) {
        return true
      }
    }

    return false
  }
}

// Lower-case `value`.
function lower(value) {
  return value.toLowerCase()
}
