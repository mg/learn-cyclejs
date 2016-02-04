// https://egghead.io/lessons/rxjs-from-toy-dom-driver-to-real-dom-driver

import Rx from 'rx'
import Cycle from '@cycle/core'
import { h1, span, makeDOMDriver } from '@cycle/dom'

export default function(mount) {
  let subLog

  // Logic (functional)
  function main(sources) {
    const mouseover$= sources.DOM.select('span').events('mouseover')
    const sinks= {
      DOM: mouseover$
        .startWith(null)          // start with fake click
        .flatMapLatest(() =>      // reset timer on click
          Rx.Observable.timer(0, 1000)
            .map(i =>
              h1(
                {style: {background: 'red'}},
                [span([`Seconds elapsed ${i}`])]
              )
            ),
        ),
      Log: Rx.Observable.timer(0, 2000)
        .map(i => 2 * i),
    }
    return sinks
  }

  // Effects (imperative)
  function consoleLogDriver(msg$) {
    subLog= msg$.subscribe(msg => console.log(msg))
  }

  const drivers= {
    DOM: makeDOMDriver(mount),
    Log: consoleLogDriver,
  }

  Cycle.run(main, drivers)
  return [subLog]
}
