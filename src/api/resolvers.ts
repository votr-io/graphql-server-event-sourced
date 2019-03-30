import { UserInputError } from 'apollo-server-core';

import { Context } from '../context';

import lodash = require('lodash');
import { inMemoryElections } from '../Election/ReadModel';

import * as tokens from '../User/tokens';
import { createBallot } from '../Ballot/store';

export const resolvers = {
  Query: {
    getElections: async (_, { input }, ctx) => {
      const { ids } = input;
      const elections = ids.map(id => inMemoryElections[id]);
      return { elections };
    },
  },
  CreateElectionResponse: {
    adminToken: ({ election }) => {
      //TODO: this may go away once we are actually emailing people
      return tokens.encryptAdminToken({
        userId: election.created_by,
        electionId: election.id,
      });
    },
  },
  Mutation: {
    createElection: async (_, { input }, ctx) => {
      const { email } = input;
      const election = await ctx.electionService.createElection(ctx, {
        electionForm: input,
        email,
      });

      return { election };
    },

    updateElection: async (_, args, ctx) => {
      const { electionId, name, description, candidates } = args.input;

      const election = await ctx.electionService.updateElection(ctx, {
        id: electionId,
        name,
        description,
        candidates,
      });
      return { election };
    },

    deleteElections: async (_, { input }, ctx) => {
      const { ids } = input;
      await ctx.electionService.deleteElections(ctx, ids);
      return true;
    },

    // startElection: async (_, { input }, ctx) => {
    //   const { electionId, status } = input;
    //   const election = await ctx.electionService.setStatus(ctx, {
    //     id: electionId,
    //     status,
    //   });

    //   return { election };
    // },
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
    castBallot: async (_, args, ctx) => {
      const { electionId, candidateIds } = args.input;
      if (candidateIds.length === 0) {
        throw new UserInputError(`why don't you try standing for something`);
      }
      const election = ctx.inMemoryElections[electionId];
      if (election.status === 'PENDING') {
        throw new UserInputError(`can't vote in an election that hasn't started yet`);
      } else if (election.status !== 'OPEN') {
        throw new UserInputError(`can't vote in an election that is closed`);
      }
      const bogusCandidates = candidateIds.filter(
        id => !election.candidates.map(candidate => candidate.id).includes(id)
      );
      if (bogusCandidates.length !== 0) {
        throw new UserInputError(
          `the following candidates are not in this election: ${bogusCandidates.join(
            ', '
          )}`
        );
      }
      const candidateIdToIndex = election.candidates.reduce((acc, { id }, i) => {
        acc[id] = i;
        return acc;
      }, {});
      await createBallot({
        electionId,
        candidateIndexes: candidateIds.map(id => candidateIdToIndex[id]),
      });
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
