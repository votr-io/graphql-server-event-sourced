import { Context } from '../../context';
import { Election } from '../types';
import { Handler, useHandler } from '../../lib/handler';
import { getElectionAndCheckPermissionsToUpdate, authenticate } from './common';
import { UserInputError } from 'apollo-server';

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

    if (election.status === 'OPEN') {
      return election;
    }

    if (election.status !== 'PENDING') {
      //TODO: replace with your own typed error - apollo shouldn't be here
      throw new UserInputError(`can't start an election that is ${election.status}`);
    }

    await ctx.eventStore.create({
      event_type: 'election_started',
      aggregate_type: 'election',
      aggregate_id: id,
      date_created: new Date().toISOString(),
      actor: ctx.claims.userId,
      data: {
        id,
      },
    });

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

export default useHandler(handler);
