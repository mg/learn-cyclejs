// Notes: https://github.com/mohamedhayibor/Rx-CycleJS-reviewNotes
import Rx from 'rx-dom'

const videos= {
  video01: require('./video01'),
  video02: require('./video02'),
  video03: require('./video03'),
  video04: require('./video04'),
  video05: require('./video05'),
  video06: require('./video06'),
  video07: require('./video07'),
  video08: require('./video08'),
  video09: require('./video09'),
  video10: require('./video10'),
  video11: require('./video11'),
  video12: require('./video12'),
  video13: require('./video13'),
  video14: require('./video14'),
  video15: require('./video15'),
  video16: require('./video16'),
  video17: require('./video17'),
}

let subscriptions

Rx.DOM.fromEvent(document.querySelectorAll('.tab'), 'click')
  .do(e => e.preventDefault())
  .map(e => e.currentTarget.getAttribute('id'))
  .subscribe(video => {
    if(subscriptions) subscriptions.forEach(s => s.dispose())
    subscriptions= videos[video]('#mount')
  })
