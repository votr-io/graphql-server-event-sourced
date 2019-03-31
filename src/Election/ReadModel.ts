import { Election } from './types';
import { Observable, of, empty, timer } from 'rxjs';

import { Events } from './events';
import { tap, catchError, last } from 'rxjs/operators';
import { projectElection } from './Election';

export type ReadModel = Record<string, Election>;

export const inMemoryReadModel: ReadModel = {};
let lastEvent = 0;

export async function waitForEvent(id: number): Promise<void> {
  if (lastEvent >= id) return;
  return timer(0)
    .toPromise()
    .then(() => waitForEvent(id));
}

export function project(event$: Observable<Events>) {
  console.log('subscribing to events to project into the in memory read model...');
  event$
    .pipe(
      tap(event => {
        lastEvent = event.id;
        console.log(`[${event.id}] [${event.event_type}] projecting...`);
        inMemoryReadModel[event.aggregate_id] = projectElection(
          [event],
          inMemoryReadModel[event.aggregate_id]
        );
      })
    )
    .subscribe();
}
