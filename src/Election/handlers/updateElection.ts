import { Context } from '../../context';
import { Election, Candidate } from '../types';
import { UserInputError } from 'apollo-server';
import { Handler, useHandler } from '../../lib/handler';
import { Events } from '../events';
import { WithoutId } from '../EventStore';
import { projectElection } from '../Election';
import { getElectionAndCheckPermissionsToUpdate, authenticate } from './common';
import uuid = require('uuid');

interface CandidateForm {
  id?: string;
  name: string;
  description?: string;
}

const handler: Handler<
  Context,
  {
    id: string;
    name?: string;
    description?: string;
    candidates?: CandidateForm[];
  },
  Promise<Election>,
  {
    id: string;
    name?: string;
    description?: string;
    candidates?: Candidate[];
  }
> = {
  authenticate,
  defaults,
  validate,
  handleRequest: async (ctx, input) => {
    const { id, name, description, candidates } = input;
    const election = await getElectionAndCheckPermissionsToUpdate(ctx, id);

    if (election.status != 'PENDING') {
      throw new UserInputError('cannot change an election after it has begun');
    }

    const events: WithoutId<Events>[] = [];
    const now = new Date().toISOString();
    const actor = ctx.claims.userId;

    if (name) {
      events.push({
        event_type: 'election_name_changed',
        aggregate_type: 'election',
        aggregate_id: id,
        date_created: now,
        actor,
        data: {
          id,
          name,
        },
      });
    }

    if (description) {
      events.push({
        event_type: 'election_description_changed',
        aggregate_type: 'election',
        aggregate_id: id,
        date_created: now,
        actor,
        data: {
          id,
          description,
        },
      });
    }

    if (candidates) {
      events.push({
        event_type: 'election_candidates_changed',
        aggregate_type: 'election',
        aggregate_id: id,
        date_created: now,
        actor,
        data: {
          id,
          candidates,
        },
      });
    }

    //persist each event
    //TODO: should probably allow create to take multiple events
    const persistedEvents = [];
    for (let i = 0; i < events.length; i++) {
      //guys, for loops are great
      const id = await ctx.eventStore.create(events[i]);
      persistedEvents.push({ id, ...events[i] });
    }

    return projectElection(persistedEvents, election);
  },
};

function defaults(input: {
  id: string;
  name?: string;
  description?: string;
  candidates?: Candidate[];
}) {
  const { candidates } = input;
  if (candidates) {
    return {
      ...input,
      candidates: candidates.map(candidate => {
        if (!candidate.id) {
          return { ...candidate, id: uuid() };
        }
        return candidate;
      }),
    };
  }
  return input;
}

function validate(input: {
  id: string;
  name?: string;
  description?: string;
  candidates?: Candidate[];
}): string {
  const errors = [];
  const { id } = input;
  if (!id || id === '') {
    errors.push('id is required');
  }
  //TODO: validate the rest of the properties here (probably add defaults too)

  if (errors.length > 0) {
    return errors.join(', ');
  }
  return null;
}

export default useHandler(handler);
