import { BallotStore } from './../Ballot/store';
import { getResults, ElectionResults } from 'alt-vote';
import { Results, Election } from './types';

export async function tallyElection(
  { ballotStore }: { ballotStore: BallotStore }, //don't need the whole context, just a way to get ballots
  election: Election
): Promise<Results> {
  let results;
  try {
    results = await getResults({
      fetchBallots: () => ballotStore.streamBallots(election.id),
    });
  } catch (e) {
    console.log(e);
  }
  return transformResults(results);
}

function transformResults({ winner, rounds }: ElectionResults): Results {
  return {
    winner,
    replay: rounds.map(round => {
      return {
        candidateTotals: Object.keys(round).map(candidateId => ({
          candidateId,
          votes: round[candidateId],
        })),
        redistribution: [], //TODO
      };
    }),
  };
}
