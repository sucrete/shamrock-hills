import {defineQuery} from 'next-sanity'

export const RATES_QUERY = defineQuery(`*[_type == "rates"]`)


export const EVENTS_QUERY = defineQuery(`*[_type == "events"] {
  ...,
  flyer {
    asset-> {
      url
    }
  },
  linkDeets {
    linkText,
    linkURL
  }
}`)


export const TICKER_QUERY = defineQuery(`*[_type == "ticker"][0] {
  tickerQuestion,
  tickerArray
}`)


export const GOLF_ASSOCIATION_QUERY = defineQuery(`*[_type == "golfAssociation"][0] { body }`)

export const MATCH_PLAY_QUERY = defineQuery(`*[_type == "matchPlay"][0] { body }`)

export const LADIES_LEAGUE_QUERY = defineQuery(`*[_type == "ladiesLeague"][0] { body }`)

export const COUPLES_LEAGUE_QUERY = defineQuery(`*[_type == "couplesLeague"][0] { body }`)

export const SENIOR_LEAGUE_QUERY = defineQuery(`*[_type == "seniorLeague"][0] { body }`)

export const LESSONS_QUERY = defineQuery(`*[_type == "lessons"][0] { body }`)

export const EMPLOYMENT_QUERY = defineQuery(`*[_type == "employment"][0] { body }`)

export const TOURNAMENTS_QUERY = defineQuery(`*[_type == "tournaments"][0] { body }`)
