// https://egghead.io/lessons/rxjs-exporting-values-from-components-through-sinks

import Rx from 'rx'
import Cycle from '@cycle/core'
import { label, input, h2, div, makeDOMDriver } from '@cycle/dom'
import isolate from '@cycle/isolate'

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
      DOM: vtree$,
      value: state$.map(state => state.value)
    }
  }

  const IsolatedLabeledSlider= sources => isolate(LabeledSlider)(sources)

  function main(sources) {
    const weightProp$= Rx.Observable.of({
      label: 'Weight',
      unit: 'kg',
      min: 40,
      max: 150,
      init: 70,
    })

    const weightSinks= IsolatedLabeledSlider({
      DOM: sources.DOM, props: weightProp$
    })
    const weightVTree$= weightSinks.DOM
    const weightValue$= weightSinks.value

    const heightProps$= Rx.Observable.of({
      label: 'Height',
      unit: 'cm',
      min: 140,
      max: 220,
      init: 170,
    })
    const heightSinks= IsolatedLabeledSlider({
      DOM: sources.DOM, props: heightProps$
    })
    const heightVTree$= heightSinks.DOM
    const heightValue$= heightSinks.value

    const bmi$= Rx.Observable.combineLatest(weightValue$, heightValue$,
      (weight, height) => {
        const heightMeters= height * 0.01
        const bmi= Math.round(weight / (heightMeters * heightMeters))
        return bmi
      }
    )

    const vtree$= Rx.Observable.combineLatest(
      bmi$, weightVTree$, heightVTree$, (bmi, weightVtree, heightVTree) =>
        div([
          weightVtree,
          heightVTree,
          h2(`BMI is ${bmi}`),
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
