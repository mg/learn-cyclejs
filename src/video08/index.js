// https://egghead.io/lessons/rxjs-fine-grained-control-over-the-dom-source

import Rx from 'rx'
import Cycle from '@cycle/core'

export default function(mount) {
  let subDom, subLog

  // Logic (functional)
  function main(sources) {
    const mouseover$= sources.DOM.selectEvents('span', 'mouseover')
    const sinks= {
      DOM: mouseover$
        .startWith(null)          // start with fake click
        .flatMapLatest(() =>      // reset timer on click
          Rx.Observable.timer(0, 1000)
            .map(i => {
              return {
                tagName: 'H1',
                children: [
                  {
                    tagName: 'SPAN',
                    children: [
                      `Seconds elapsed ${i}`
                    ]
                  }
                ]
              }
            }),
        ),
      Log: Rx.Observable.timer(0, 2000)
        .map(i => 2 * i),
    }
    return sinks
  }

  // Effects (imperative)
  function DOMDriver(obj$) {
    function createElement(obj) {
      const element= document.createElement(obj.tagName)
      obj.children
        .filter(c => typeof c === 'object')
        .map(createElement)
        .forEach(c => element.appendChild(c))

      obj.children
        .filter(c => typeof c === 'string')
        .forEach(c => element.innerHTML += c)

      return element
    }

    subDom= obj$.subscribe(obj => {
      const container= document.querySelector(mount)
      container.innerHTML= ''
      const element= createElement(obj)
      container.appendChild(element)
    })

    const DOMSource= {
      selectEvents: function(tagName, eventType) {
        return Rx.Observable.fromEvent(document, eventType)
          .filter(ev => ev.target.tagName === tagName.toUpperCase())
      }
    }
    return DOMSource
  }

  function consoleLogDriver(msg$) {
    subLog= msg$.subscribe(msg => console.log(msg))
  }

  const drivers= {
    DOM: DOMDriver,
    Log: consoleLogDriver,
  }

  Cycle.run(main, drivers)
  return [subDom, subLog]
}
