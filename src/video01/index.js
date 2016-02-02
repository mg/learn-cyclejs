// https://egghead.io/lessons/rxjs-the-cycle-js-principle-separating-logic-from-effects

import Rx from 'rx'

// Guiding principle of Cycle.js: Seperating Logic from Effects. Effects are
// anything that change the external world. We want to push Effects as far away
// from our app as possible

export default function(mount) {
  // Logic lives in streams (functional)
  let subscription= Rx.Observable.timer(0, 1000) //0--1--2--3--4--5--6--
    .map(i => `Seconds elapsed ${i}`)

    // Effects live in subscribe (imperative)
    .subscribe(text => {
      const container= document.querySelector(mount)
      container.textContent= text
    })
  return [subscription]
}
