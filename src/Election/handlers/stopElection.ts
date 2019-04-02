import { Context } from '../../context';
import { Election, Results } from '../types';
import { Handler, useHandler } from '../../lib/handler';
import { getElectionAndCheckPermissionsToUpdate, authenticate } from './common';
import { UserInputError } from 'apollo-server';
import countVotes from '../../Ballot/handlers/countVotes';
import { ElectionResults } from 'alt-vote';

const handler: Handler<
  Context,
  {
    id: string;
  },
  Promise<Election>
> = {
  authenticate,
  validate,
  handleRequest: async (ctx, { id }) => {
    const election = await getElectionAndCheckPermissionsToUpdate(ctx, id);

    if (election.status === 'CLOSED') {
      return election;
    }

    if (election.status !== 'OPEN') {
      //TODO: replace with your own typed error - apollo shouldn't be here
      throw new UserInputError(`can't stop an election that is ${election.status}`);
    }

    //the election has stopped
    await ctx.eventStore.create({
      event_type: 'election_stopped',
      aggregate_type: 'election',
      aggregate_id: id,
      date_created: new Date().toISOString(),
      actor: ctx.claims.userId,
      data: {
        id,
      },
    });

    //now that the election is stopped, we need to calculate results
    try {
      const rawResults = await countVotes(ctx, { electionId: election.id });
      await ctx.eventStore.create({
        event_type: 'votes_counted',
        aggregate_type: 'election',
        aggregate_id: id,
        date_created: new Date().toISOString(),
        actor: 'system',
        data: {
          results: transformResults(rawResults),
        },
      });
    } catch (e) {
      console.log(e);
    }

    //return the full election, now with results
    return ctx.eventStore.getElection(id);
  },
};

function validate(input: { id: string }): string {
  const errors = [];
  const { id } = input;
  if (!id || id === '') {
    errors.push('id is required');
  }

  if (errors.length > 0) {
    return errors.join(', ');
  }
  return null;
}

//helper to go from raw results to what we've defined on the election model
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

export default useHandler(handler);
