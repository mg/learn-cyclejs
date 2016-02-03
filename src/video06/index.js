// https://egghead.io/lessons/rxjs-generalizing-run-function-for-more-types-of-sources

import Rx from 'rx'

export default function(mount) {
  let subDom, subLog

  // Logic (functional)
  function main(sources) {
    const click$= sources.DOM
    const sinks= {
      DOM: click$
        .startWith(null)          // start with fake click
        .flatMapLatest(() =>      // reset timer on click
          Rx.Observable.timer(0, 1000)
            .map(i => `Seconds elapsed ${i}`),
        ),
      Log: Rx.Observable.timer(0, 2000)
        .map(i => 2 * i),
    }
    return sinks
  }

  // Effects (imperative)
  function DOMDriver(text$) {
    subDom= text$.subscribe(text => {
      const container= document.querySelector(mount)
      container.textContent= text
    })

    const DOMSource= Rx.Observable.fromEvent(document, 'click')
    return DOMSource
  }

  function consoleLogDriver(msg$) {
    subLog= msg$.subscribe(msg => console.log(msg))
  }

  const drivers= {
    DOM: DOMDriver,
    Log: consoleLogDriver,
  }

  // Cycle.run
  function run(mainFn, drivers) {
    const proxySources= {}
    Object.keys(drivers).forEach(key => {
      proxySources[key]= new Rx.Subject()
    })
    const sinks= mainFn(proxySources)
    Object.keys(drivers).forEach(key => {
      const source= drivers[key](sinks[key])
      if(source !== undefined) {
        source.subscribe(x => proxySources[key].onNext(x))
      }
    })
  }

  run(main, drivers)
  return [subDom, subLog]
}
