import { Election } from './types';
import { Observable, of, empty } from 'rxjs';

import { Events } from './events';
import { tap, catchError } from 'rxjs/operators';

export type ReadModel = Record<string, Election>;

export const state: ReadModel = {};

export function project(event$: Observable<Events>) {
  let election: Election;
  console.log('subscribing to the events in the ReadModel');
  event$
    .pipe(
      tap(event => {
        console.log(`processing event type ${event.event_type}`);
        const { date_created, actor } = event;
        switch (event.event_type) {
          case 'election_created':
            state[event.data.id] = {
              ...event.data,
              dateCreated: date_created,
              dateUpdated: date_created,
              createdBy: actor,
              status: 'PENDING',
              statusTransitions: [
                {
                  on: date_created,
                  status: 'PENDING',
                },
              ],
            };
            break;
          case 'election_name_changed':
            election = state[event.data.id];
            if (election) {
              election.dateUpdated = date_created;
              election.name = event.data.name;
            }
            break;
          case 'election_description_changed':
            election = state[event.data.id];
            if (election) {
              election.dateUpdated = date_created;
              election.description = event.data.description;
            }
            break;
          case 'election_candidates_changed':
            election = state[event.data.id];
            if (election) {
              election.dateUpdated = date_created;
              election.candidates = event.data.candidates;
            }
            break;
          case 'election_started':
            election = state[event.data.id];
            if (election) {
              election.dateUpdated = date_created;
              election.status = 'OPEN';
              election.statusTransitions.push({
                on: date_created,
                status: 'OPEN',
              });
            }
            break;
          case 'election_stopped':
            election = state[event.data.id];
            if (election) {
              election.dateUpdated = date_created;
              election.status = 'CLOSED';
              election.statusTransitions.push({
                on: date_created,
                status: 'CLOSED',
              });
            }
            break;
        }
      })
    )
    .subscribe();
}
