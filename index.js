const fetch = require('isomorphic-fetch')
const jsdom = require('jsdom')
const fs = require('fs')

// urls from this google search: ("Register" site:http://www.ldoceonline.com), excluding those, who has 'register' in url
const urls = require('./urls.json')

// Utils
const map = func => arr => arr.map(func)
const fetchMarkup = url => fetch(url).then(resp => resp.text())
const { JSDOM } = jsdom
const domify = markup => new JSDOM(markup)
const getRegisterNodes = dom => [
    ...dom.window.document.querySelectorAll('.F2NBox')
]
const removeHeading = registerNode => {
    const clone = registerNode.cloneNode(true)
    clone.firstElementChild.remove()
    return clone
}
const innerHTML = node => node.innerHTML
const join = symb => arr => arr.join(symb)
const flatten = arr => arr.reduce((a, b) => a.concat(b), [])
const filter = func => arr => arr.filter(func)
const writeFile = cards => fs.writeFileSync('cards.txt', cards)

// Main
Promise.all(urls.map(fetchMarkup))
    .then(map(domify))
    .then(map(getRegisterNodes))
    .then(flatten)
    .then(map(removeHeading))
    .then(map(innerHTML))
    .then(join('\n'))
    .then(writeFile)
    .catch(console.log)
