// https://egghead.io/lessons/rxjs-model-view-intent-pattern-for-separation-of-concerns

import Rx from 'rx'
import Cycle from '@cycle/core'
import { label, input, h2, div, makeDOMDriver } from '@cycle/dom'

const START_WEIGHT= 70
const START_HEIGHT= 170

// Using Model-View-Intent for the sandwich pattern

// DOM read: detect slider change (Intent)
// logic: recalculate BMI         (Model)
// DOM write: display BMI         (View)

function intent(DOMSource) {
  const changeWeight$= DOMSource.select('.weight').events('input')
    .map(ev => ev.target.value)

  const changeHeight$= DOMSource.select('.height').events('input')
    .map(ev => ev.target.value)

  return {changeWeight$, changeHeight$}
}

function model({changeWeight$, changeHeight$}) {
  return Rx.Observable.combineLatest(
    changeWeight$.startWith(START_WEIGHT),
    changeHeight$.startWith(START_HEIGHT),
    (weight, height) => {
      const heightMeters= height * 0.01
      const bmi= Math.round(weight / (heightMeters * heightMeters))
      return { bmi, weight, height }
    }
  )
}

function view(state$) {
  return state$.map(state =>
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
  )
}
export default function(mount) {
  // Logic (functional)
  function main(sources) {
    const changeStreams= intent(sources.DOM)
    const state$= model(changeStreams)
    const vtree$= view(state$)

    return {
      DOM: vtree$
    }
  }

  // Effects (imperative)
  const drivers= {
    DOM: makeDOMDriver(mount),
  }

  Cycle.run(main, drivers)
  return []
}
