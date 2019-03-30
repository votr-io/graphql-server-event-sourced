import { Context } from '../context';
import { Election, ElectionStatus } from './types';
import { ForbiddenError, UserInputError } from 'apollo-server';
import * as tokens from '../User/tokens';
import { createElectionHandler } from './handlers/createElection';
import { getElectionsHandler } from './handlers/getElections';
import { updateElection } from './handlers/updateElection';
import { deleteElections } from './handlers/deleteElections';
import { startElection } from './handlers/startElection';
import { stopElection } from './handlers/stopElection';
import { inMemoryElections } from './ReadModel';

export interface ElectionForm {
  name: string;
  description?: string;
  candidates: CandidateForm[];
}

export interface CandidateForm {
  id?: string;
  name: string;
  description?: string;
}

export interface Handler<Context, Input, Output> {
  authenticate?(ctx: Context): string;
  authorize?(ctx: Context, input: Input): string;
  validate?(input: Input): string;
  handleRequest(ctx: Context, input: Input): Output;
}

function useHandler<Context, Input, Output>(
  handler: Handler<Context, Input, Output>
): (ctx: Context, input: Input) => Output {
  return (ctx, input) => {
    if (handler.authenticate) {
      const error = handler.authenticate(ctx);
      if (error) throw new Error(`authentication error: ${error}`);
    }

    if (handler.authorize) {
      const error = handler.authorize(ctx, input);
      if (error) throw new Error(`authorization error: ${error}`);
    }

    if (handler.validate) {
      const error = handler.validate(input);
      if (error) throw new UserInputError(error);
    }

    return handler.handleRequest(ctx, input);
  };
}

export interface ElectionService {
  getElections(ctx: Context, ids: string[]): Promise<Election[]>;
  createElection(
    ctx: Context,
    input: {
      electionForm: ElectionForm;
      email: string;
    }
  ): Promise<Election>;
  updateElection(
    ctx: Context,
    input: {
      id: string;
      name?: string;
      description?: string;
      candidates?: CandidateForm[];
    }
  ): Promise<Election>;
  deleteElections(ctx: Context, ids: string[]): Promise<void>;

  startElection(ctx: Context, id: string): Promise<Election>;
  stopElection(ctx: Context, id: string): Promise<Election>;
}

export const electionService: ElectionService = {
  getElections: useHandler(getElectionsHandler),
  createElection: useHandler(createElectionHandler),
  updateElection,
  deleteElections,
  startElection,
  stopElection,
};

export async function getElectionAndCheckPermissionsToUpdate(
  token: string,
  electionId: string
): Promise<Election> {
  const claims = tokens.validate(token);
  const election = inMemoryElections[electionId];

  if (election.createdBy !== claims.userId) {
    throw new ForbiddenError('403');
  }
  if (tokens.isWeakClaims(claims) && claims.electionId !== election.id) {
    throw new ForbiddenError('403');
  }

  return election;
}
