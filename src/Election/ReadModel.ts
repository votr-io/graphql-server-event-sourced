import { Election } from './types';
import { Observable, of, empty, timer } from 'rxjs';

import { Events } from './events';
import { tap, catchError, last } from 'rxjs/operators';

export type ReadModel = Record<string, Election>;

export const inMemoryElections: ReadModel = {};
let lastEvent = 0;

export async function waitForEvent(id: number): Promise<void> {
  if (lastEvent >= id) return;
  return timer(0)
    .toPromise()
    .then(() => waitForEvent(id));
}

export function project(event$: Observable<Events>) {
  let election: Election;
  console.log('subscribing to events to project into the in memory read model...');
  event$
    .pipe(
      tap(event => {
        lastEvent = event.id;
        console.log(`[${event.id}] [${event.event_type}] projecting...`);
        const { date_created, actor } = event;
        switch (event.event_type) {
          case 'election_created':
            inMemoryElections[event.data.id] = {
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
            election = inMemoryElections[event.data.id];
            if (election) {
              election.dateUpdated = date_created;
              election.name = event.data.name;
            }
            break;
          case 'election_description_changed':
            election = inMemoryElections[event.data.id];
            if (election) {
              election.dateUpdated = date_created;
              election.description = event.data.description;
            }
            break;
          case 'election_candidates_changed':
            election = inMemoryElections[event.data.id];
            if (election) {
              election.dateUpdated = date_created;
              election.candidates = event.data.candidates;
            }
            break;
          case 'election_started':
            election = inMemoryElections[event.data.id];
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
            election = inMemoryElections[event.data.id];
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
