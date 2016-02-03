// https://egghead.io/lessons/rxjs-read-effects-from-the-dom-click-events

// terminology
// source: input (read) effects
// sink: output (write) effects

// core idea in cycle.js
// a= f(b)
// b= g(a)

import Rx from 'rx'

export default function(mount) {
  let subDom, subLog

  // Logic (functional)
  function main(DOMSource) {
    const click$= DOMSource
    return {
      DOM: click$
        .startWith(null)          // start with fake click
        .flatMapLatest(() =>      // reset timer on click
          Rx.Observable.timer(0, 1000)
            .map(i => `Seconds elapsed ${i}`),
        ),
      Log: Rx.Observable.timer(0, 2000)
        .map(i => 2 * i),
    }
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

  function run(mainFn, drivers) {
    const proxyDOMSource= new Rx.Subject()                        // create a proxy for b
    const sinks= mainFn(proxyDOMSource)                           // create a from proxy b
    const DOMSource= drivers.DOM(sinks.DOM)                       // get real b from a
    DOMSource.subscribe(click => proxyDOMSource.onNext(click))    // connect real b to proxy b
    //Object.keys(drivers).forEach(key => drivers[key](sinks[key]))
  }

  run(main, drivers)
  return [subDom, subLog]
}
