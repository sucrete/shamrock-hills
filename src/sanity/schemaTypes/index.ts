import { SchemaTypeDefinition } from 'sanity';

// DOCUMENTS
import ratesType from './ratesType';
import tickerType from './tickerType';
import eventType from './eventType';
import golfAssociationType from './golfAssociationType';
import matchPlayType from './matchPlayType';
import seniorLeagueType from './seniorLeagueType';
import ladiesLeagueType from './ladiesLeagueType';
import couplesLeagueType from './couplesLeagueType';
import employmentType from './employmentType';
import lessonsType from './lessonsType';
import tournamentsType from './tournamentsType';

// OBJECTS
import miscRates from './objects/miscRates';
import standardRates from './objects/standardRates';
import linkDetails from './objects/linkDetails';

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  ratesType,
  tickerType,
  eventType,
  golfAssociationType,
  matchPlayType,
  seniorLeagueType,
  ladiesLeagueType,
  couplesLeagueType,
  employmentType,
  lessonsType,
  tournamentsType,
  // Objects
  miscRates,
  standardRates,
  linkDetails,
];
