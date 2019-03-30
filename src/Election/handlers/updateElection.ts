import { Context } from '../../context';
import { Election } from '../types';
import { UserInputError } from 'apollo-server';
import { getElectionAndCheckPermissionsToUpdate, CandidateForm } from '../service';
const uuid = require('uuid/v4');

export async function updateElection(
  ctx: Context,
  input: {
    id: string;
    name?: string;
    description?: string;
    candidates?: CandidateForm[];
  }
): Promise<Election> {
  const { id, name, description, candidates } = input;
  const election = await getElectionAndCheckPermissionsToUpdate(ctx.token, id);

  if (election.status != 'PENDING') {
    throw new UserInputError('cannot change an election after it has begun');
  }

  const now = new Date().toISOString();

  // const updatedElection = await db.updateElection({
  //   election: {
  //     ...election,
  //     date_updated: now,
  //     name: name ? name : election.name,
  //     description: description ? description : election.description,
  //     candidates: candidates
  //       ? candidates.map(({ id, name, description }) => ({
  //           id: id ? id : uuid(),
  //           name,
  //           description: description ? description : '',
  //         }))
  //       : election.candidates,
  //   },
  // });

  // return updatedElection;
  throw new Error('not yet');
}
