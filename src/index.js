// Notes: https://github.com/mohamedhayibor/Rx-CycleJS-reviewNotes
import Rx from 'rx-dom'

const videos= {
  video01: require('./video01'),
  video02: require('./video02'),
  video03: require('./video03'),
}

let subscriptions

Rx.DOM.fromEvent(document.querySelectorAll('.tab'), 'click')
  .do(e => e.preventDefault())
  .map(e => e.currentTarget.getAttribute('id'))
  .subscribe(video => {
    if(subscriptions) subscriptions.forEach(s => s.dispose())
    subscriptions= videos[video]('#mount')
  })
