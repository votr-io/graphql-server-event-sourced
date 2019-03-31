import { Context } from '../../context';
import { Election } from '../types';
import { ForbiddenError } from 'apollo-server';
import * as tokens from '../../User/tokens';

export function authenticate(ctx: Context) {
  ctx.claims = tokens.validate(ctx.token);
  return null;
}

export async function getElectionAndCheckPermissionsToUpdate(
  ctx: Context,
  id: string
): Promise<Election> {
  const claims = tokens.validate(ctx.token);
  const election = await ctx.eventStore.getElection(id);

  if (election.createdBy !== claims.userId) {
    //TODO: make your own typed errors, don't use apollo here
    throw new ForbiddenError('403');
  }
  if (tokens.isWeakClaims(claims) && claims.electionId !== election.id) {
    //TODO: make your own typed errors, don't use apollo here
    throw new ForbiddenError('403');
  }

  return election;
}
