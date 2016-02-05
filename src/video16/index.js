// https://egghead.io/lessons/rxjs-our-first-component-a-labeled-slider

import Rx from 'rx'
import Cycle from '@cycle/core'
import { label, input, h2, div, makeDOMDriver } from '@cycle/dom'


export default function(mount) {
  // Logic (functional)
  const intent= DOMSource =>
    DOMSource.select('.slider').events('input')
      .map(ev => ev.target.value)

  const model= (change$, props$) => {
    const initialValue$= props$.map(props => props.init).first()
    const value$= initialValue$.concat(change$)
    return Rx.Observable.combineLatest(
      value$,
      props$,
      (value, props) => {
        return {
          label: props.label,
          unit: props.unit,
          min: props.min,
          max: props.max,
          value,
        }
      }
    )
  }

  const view= state$ => state$.map(state =>
    div('.labeled-slider', [
      label('.label', `${state.label}: ${state.value}${state.unit}`),
      input('.slider', {type: 'range', min: state.min, max: state.max, value: state.value})
    ])
  )

  function main(sources) {
    const change$= intent(sources.DOM)
    const state$= model(change$, sources.props)
    const vtree$= view(state$)

    return {
      DOM: vtree$
    }
  }

  // Effects (imperative)
  const drivers= {
    DOM: makeDOMDriver(mount),
    props: () => Rx.Observable.of({
      label: 'Height',
      unit: 'cm',
      min: 140,
      max: 220,
      init: 170,
    })
  }

  Cycle.run(main, drivers)
  return []
}
