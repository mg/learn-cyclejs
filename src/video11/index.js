// https://egghead.io/lessons/rxjs-hello-world-in-cycle-js

import Rx from 'rx'
import Cycle from '@cycle/core'
import { label, input, h1, hr, div, makeDOMDriver } from '@cycle/dom'

export default function(mount) {
  // Logic (functional)
  function main(sources) {
    const inputEv$= sources.DOM.select('.field').events('input')
    const name$= inputEv$.map(ev => ev.target.value).startWith('')

    return {
      DOM: name$.map(name =>
        div([
          label('Name:'),
          input('.field', {type: 'text'}),
          hr(),
          h1(`Hello ${name}`)
        ])
      )
    }
  }

  // Effects (imperative)
  const drivers= {
    DOM: makeDOMDriver(mount),
  }

  Cycle.run(main, drivers)
  return []
}
