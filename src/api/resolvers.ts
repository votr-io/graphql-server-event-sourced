import { Context } from '../context';

import lodash = require('lodash');

import * as tokens from '../User/tokens';

import createElection from '../Election/handlers/createElection';
import { IResolvers } from './generated/resolvers';
import updateElection from '../Election/handlers/updateElection';
import castBallot from '../Ballot/handlers/castBallot';
import startElection from '../Election/handlers/startElection';
import stopElection from '../Election/handlers/stopElection';
import { Candidate } from '../Election/types';

export const resolvers: IResolvers<Context> = {
  Query: {
    getElections: async (_, { input }, ctx: Context) => {
      const elections = input.ids.map(id => ctx.readModel[id]);

      return { elections };
    },
  },
  Election: {
    candidates: (election, _, ctx) => {
      function shouldShuffle() {
        return (
          election.status === 'OPEN' &&
          ctx.claims &&
          ctx.claims.userId === election.createdBy
        );
      }

      //shuffle candidates to prevent order from causing any bias during voting
      return shouldShuffle() ? shuffle(election.candidates) : election.candidates;
    },
    results: ({ results, candidates }) => {
      if (!results) return undefined;
      //helper function to resolve votes by candidate_id into fully formed Candidates
      //doing this here rather than it's own resolver because we need the Candidates[] off the election
      function resolveCandidateVotes(
        candidateTotals: { candidateId: string; votes: number }[],
        candidates: Candidate[]
      ) {
        return candidateTotals.map(({ candidateId, votes }) => ({
          candidate: candidates.find(({ id }) => id === candidateId),
          votes,
        }));
      }

      return {
        winner: candidates.find(({ id }) => id === results.winner),
        replay: results.replay.map(({ candidateTotals, redistribution }) => {
          return {
            candidateTotals: resolveCandidateVotes(candidateTotals, candidates),
            redistribution: redistribution
              ? resolveCandidateVotes(redistribution, candidates)
              : undefined,
          };
        }),
      };
    },
  },
  CreateElectionResponse: {
    adminToken: ({ election }) => {
      //TODO: this may go away once we are actually emailing people
      return tokens.encryptAdminToken({
        userId: election.createdBy,
        electionId: election.id,
      });
    },
  },
  Mutation: {
    createElection: async (_, { input }, ctx: Context) => {
      const { email } = input;
      const election = await createElection(ctx, {
        electionForm: input,
        email,
      });

      return { election };
    },

    updateElection: async (_, { input }, ctx) => {
      const election = await updateElection(ctx, {
        id: input.electionId,
        ...input,
      });
      return { election };
    },

    deleteElections: async (_, { input }, ctx) => {
      throw new Error('not implimented');
    },

    startElection: async (_, { input }, ctx) => {
      const election = await startElection(ctx, { id: input.electionId });
      return { election };
    },

    stopElection: async (_, { input }, ctx) => {
      const election = await stopElection(ctx, { id: input.electionId });
      return { election };
    },

    weakLogin: async (_, args: { input: { adminToken: string } }, ctx) => {
      const { adminToken } = args.input;

      const { userId, electionId } = tokens.descryptAdminToken(adminToken);

      const [user] = await ctx.userStore.getUsers([userId]);
      if (user == null) {
        throw new Error('user not found');
      }
      if (user.type !== 'WEAK') {
        throw new Error('not a weak user');
      }

      return { accessToken: tokens.sign({ userId, electionId }) };
    },

    castBallot: async (_, { input }, ctx) => {
      await castBallot(ctx, input);
      return true;
    },
  },
};

//https://bost.ocks.org/mike/shuffle/
function shuffle<T>(ogArray: T[]) {
  const array = lodash.cloneDeep(ogArray);
  var m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}
