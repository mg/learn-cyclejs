// https://egghead.io/lessons/rxjs-multiple-independent-instances-of-a-component

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

  function LabeledSlider(sources) {
    const change$= intent(sources.DOM)
    const state$= model(change$, sources.props)
    const vtree$= view(state$)

    return {
      DOM: vtree$
    }
  }

  function main(sources) {
    const weightProp$= Rx.Observable.of({
      label: 'Weight',
      unit: 'kg',
      min: 40,
      max: 150,
      init: 70,
    })
    const weightSinks= LabeledSlider({
      DOM: sources.DOM.select('.weight'), props: weightProp$
    })
    const weightVTree$= weightSinks.DOM.map(vtree => {
      vtree.properties.className += ' weight'
      return vtree
    })

    const heightProps$= Rx.Observable.of({
      label: 'Height',
      unit: 'cm',
      min: 140,
      max: 220,
      init: 170,
    })
    const heightSinks= LabeledSlider({
      DOM: sources.DOM.select('.height'), props: heightProps$
    })
    const heightVTree$= heightSinks.DOM.map(vtree => {
      vtree.properties.className += ' height'
      return vtree
    })

    const vtree$= Rx.Observable.combineLatest(
      weightVTree$, heightVTree$, (weightVtree, heightVTree) =>
        div([
          weightVtree,
          heightVTree,
        ])
    )

    return {
      DOM: vtree$,
    }
  }

  // Effects (imperative)
  const drivers= {
    DOM: makeDOMDriver(mount),
  }

  Cycle.run(main, drivers)
  return []
}
