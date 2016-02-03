// https://egghead.io/lessons/rxjs-introducing-run-and-driver-functions

import Rx from 'rx'

export default function(mount) {
  let subDom, subLog

  // Logic (functional)
  function main() {
    return {
      DOM: Rx.Observable.timer(0, 1000)
        .map(i => `Seconds elapsed ${i}`),
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
  }

  function consoleLogDriver(msg$) {
    subLog= msg$.subscribe(msg => console.log(msg))
  }

  const drivers= {
    DOM: DOMDriver,
    Log: consoleLogDriver,
  }

  function run(mainFn, drivers) {
    const sinks= mainFn()
    Object.keys(drivers).forEach(key => drivers[key](sinks[key]))
  }

  run(main, drivers)
  return [subDom, subLog]
}
