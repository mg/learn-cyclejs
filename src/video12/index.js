// https://egghead.io/lessons/rxjs-an-interactive-counter-in-cycle-js

import Rx from 'rx'
import Cycle from '@cycle/core'
import { button, p, label, div, makeDOMDriver } from '@cycle/dom'

export default function(mount) {
  // Logic (functional)
  function main(sources) {
    const decrementClick$= sources.DOM
      .select('#decrement').events('click')
    const increnmentClick$= sources.DOM
      .select('#increment').events('click')

    const decrementAction$= decrementClick$.map(ev => -1)
    const incrementAction$= increnmentClick$.map(ev => +1)

    // main method of keeping state in cyclejs/rxjs is the scan operator
    const number$= Rx.Observable.of(10)
      .merge(decrementAction$).merge(incrementAction$)
      .scan((prev, cur) => prev + cur)

    return {
      DOM: number$.map(number =>
        div([
          button('#decrement', 'Decrement'),
          button('#increment', 'Increment'),
          p([
            label(`${number}`)
          ])
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
