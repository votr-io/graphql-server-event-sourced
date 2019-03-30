// import * as db from '../../db/election';
// import { Context } from '../../context';
// import { Election, ElectionStatus } from '../types';
// import { UserInputError } from 'apollo-server';
// import { getElectionAndCheckPermissionsToUpdate } from '../service';
// import { tallyElection } from '../../tallyElection';
// const uuid = require('uuid/v4');

// export async function setStatus(
//   ctx: Context,
//   input: { id: string; status: ElectionStatus }
// ): Promise<Election> {
//   const { id, status } = input;

//   const election = await getElectionAndCheckPermissionsToUpdate(ctx.token, id);

//   if (election.status === status) {
//     return election;
//   }

//   //TODO: clean up this validation and make it data driven with good error messaging
//   if (election.status === 'PENDING' && status !== 'OPEN') {
//     throw new UserInputError('invalid status transition');
//   }
//   if (election.status === 'OPEN' && status !== 'TALLYING') {
//     throw new UserInputError('invalid status transition');
//   }

//   const now = new Date().toISOString();
//   const updatedElection = await db.updateElection({
//     election: {
//       ...election,
//       status,
//       date_updated: now,
//       status_transitions: [...election.status_transitions, { status, on: now }],
//     },
//   });

//   //TODO: move this someplace else and handle tallying failure
//   if (updatedElection.status === 'TALLYING') {
//     await tallyElection(election.id);
//   }

//   return updatedElection;
// }
