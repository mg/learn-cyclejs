// https://egghead.io/lessons/rxjs-main-function-and-effects-functions

import Rx from 'rx'

export default function(mount) {
  let subDom, subLog

  // Logic (functional)
  function main() {
    return Rx.Observable.timer(0, 1000) //0--1--2--3--4--5--6--
      .map(i => `Seconds elapsed ${i}`)
  }

  // Effects (imperative)
  function DOMEffect(text$) {
    subDom= text$.subscribe(text => {
      const container= document.querySelector(mount)
      container.textContent= text
    })
  }

  function consoleLogEffect(msg$) {
    subLog= msg$.subscribe(msg => console.log(msg))
  }

  const sink= main()
  DOMEffect(sink)
  consoleLogEffect(sink)

  return [subDom, subLog]
}
