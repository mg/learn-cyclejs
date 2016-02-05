// https://egghead.io/lessons/rxjs-body-mass-index-calculator-built-in-cycle-js

import Rx from 'rx'
import Cycle from '@cycle/core'
import { label, input, h2, div, makeDOMDriver } from '@cycle/dom'

const START_WEIGHT= 70
const START_HEIGHT= 170

// sandwich pattern: read - logic - write
// DOM read: detect slider change
// logic: recalculate BMI
// DOM write: display BMI

export default function(mount) {
  // Logic (functional)
  function main(sources) {
    const changeWeight$= sources.DOM.select('.weight').events('input')
      .map(ev => ev.target.value)

    const changeHeight$= sources.DOM.select('.height').events('input')
      .map(ev => ev.target.value)

    const state$= Rx.Observable.combineLatest(
      changeWeight$.startWith(START_WEIGHT),
      changeHeight$.startWith(START_HEIGHT),
      (weight, height) => {
        const heightMeters= height * 0.01
        const bmi= Math.round(weight / (heightMeters * heightMeters))
        return { bmi, weight, height }
      }
    )
    return {
      DOM: state$.map(state =>
        div([
          div([
            label(`Weight: ${state.weight}kg`),
            input('.weight', {type: 'range', min: 40, max: 150, value: state.weight})
          ]),
          div([
            label(`Height: ${state.height}cm`),
            input('.height', {type: 'range', min: 140, max: 220, value: state.height})
          ]),
          h2(`BMI is ${state.bmi}`)
        ])
      ),
    }
  }

  // Effects (imperative)
  const drivers= {
    DOM: makeDOMDriver(mount),
  }

  Cycle.run(main, drivers)
  return []
}
