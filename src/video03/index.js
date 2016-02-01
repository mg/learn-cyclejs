// https://egghead.io/lessons/rxjs-customizing-effects-from-the-main-function

import Rx from 'rx'

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
function DOMEffect(text$) {
  text$.subscribe(text => {
    const container= document.querySelector('#video03 div.mount')
    container.textContent= text
  })
}

function consoleLogEffect(msg$) {
  msg$.subscribe(msg => console.log(msg))
}

const sinks= main()
DOMEffect(sinks.DOM)
consoleLogEffect(sinks.Log)
