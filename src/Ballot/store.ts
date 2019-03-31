import { Observable } from 'rxjs';
import * as QueryStream from 'pg-query-stream';
import { inMemoryReadModel } from '../Election/ReadModel';
import { db } from '../db';

export interface BallotStore {
  //TOOD: refactor this to take candidate ids - the index thing is a concern of the DB
  createBallot(input: { electionId: string; candidateIndexes: number[] }): Promise<void>;
  streamBallots(electionId: string): Observable<string[]>;
}

export const postgresBallotStore: BallotStore = {
  createBallot: async ({ electionId, candidateIndexes }) => {
    await db.none(`INSERT INTO ballots VALUES($1, $2)`, [
      electionId,
      JSON.stringify(candidateIndexes),
    ]);
  },

  streamBallots: electionId => {
    return new Observable(o => {
      //start by getting the election so we can do the tranlation of candidate index to candidate id
      const election = inMemoryReadModel[electionId];
      const candidates = election.candidates;

      //now that we have the election, set up our stream of ballots out of the db
      //this library should handle back pressure and keep our memory use low
      const qs = new QueryStream(`SELECT * FROM ballots where election_id = $1`, [
        electionId,
      ]);

      //stream rows out of the db, transform the index based ballot to candidate ids, and next the value onto the observable
      db.stream(qs, stream => {
        stream.on('error', o.error);
        stream.on('data', ({ ballot }) => {
          const indexBallot: number[] = JSON.parse(ballot);
          o.next(indexBallot.map(candidateIndex => candidates[candidateIndex].id));
        });
        stream.on('end', () => o.complete());
      });
    });
  },
};
