// https://egghead.io/lessons/rxjs-using-the-http-driver

import Rx from 'rx'
import Cycle from '@cycle/core'
import { button, h1, h4, a, div, makeDOMDriver } from '@cycle/dom'
import { makeHTTPDriver } from '@cycle/http'

const URL_FIRST_USER= 'http://jsonplaceholder.typicode.com/users/1'

// which are write effects (sinks), and which are read effects (sources)?

// DOM read: button clicked
// HTTP write: request sent
// HTTP read: response received
// DOM write: data display

export default function(mount) {
  // Logic (functional)
  function main(sources) {
    // DOM read: button clicked
    const clickEvent$= sources.DOM
      .select('.get-first').events('click')

    // HTTP write: request sent
    const request$= clickEvent$.map(() => {
      return {
        url: URL_FIRST_USER,
        method: 'GET',
      }
    })

    // HTTP read: response recieved
    const response$$= sources.HTTP
      .filter(response$ => response$.request.url === URL_FIRST_USER) //filter for the response branch strema we want

    // --------r--------------------------r------------------   response$$
    //         \--a-                      \---b--               responseBranch$

    const response$= response$$.switch() // stream of response branch stream
    const firstUser$= response$
      .map(response => response.body)
      .startWith(null)

    return {
      DOM: firstUser$.map(user =>
        div([
          button('.get-first', 'Get first user'),
          user === null ? null : div('.user-details', [
            h1('.user-name', user.name),
            h4('.user-email', user.email),
            a('.user-website', {href: user.website}, user.website)
          ])
        ])
      ),

      HTTP: request$,
    }
  }

  // Effects (imperative)
  const drivers= {
    DOM: makeDOMDriver(mount),
    HTTP: makeHTTPDriver(),
  }

  Cycle.run(main, drivers)
  return []
}
