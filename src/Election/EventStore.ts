import { Observable } from 'rxjs';
import { Events } from './events';
import { db } from '../db';
import { Election } from './types';
import { projectElection } from './Election';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
export type WithoutId<T> = Omit<T, 'id'>;

export interface Event {
  id: number;
  event_type: string;
  aggregate_type: string;
  aggregate_id: string;
  date_created: string;
  actor: string;
  data: object;
}

export interface EventStore {
  create(event: WithoutId<Events>): Promise<number>;
  stream(): Observable<Events>;
}

export const postgresEventStore: EventStore = {
  create: async event => {
    const query = `INSERT INTO events(event_type, aggregate_type, aggregate_id, date_created, actor, data) VALUES($1, $2, $3, $4, $5, $6) RETURNING id;`;
    const { id } = await db.one(query, [
      event.event_type,
      event.aggregate_type,
      event.aggregate_id,
      event.date_created,
      event.actor,
      JSON.stringify(event.data),
    ]);
    return id;
  },
  stream: () => {
    return new Observable<Events>(observer => {
      //This is a crazy naive implimentation of how to stream events
      //this is not accounting for events that are being created while getting past events
      db.connect().then(async connection => {
        console.log('getting past events....');
        const events = await connection.any('SELECT * FROM events;');
        events.forEach(event => observer.next(event));

        console.log('listening for new events....');
        connection.client.on('notification', msg => {
          const event = JSON.parse(msg.payload);
          observer.next(event);
        });

        connection.none('LISTEN new_event');
      });
    });
  },
};

export async function getElection(id: string): Promise<Election> {
  const events = await db.any('SELECT * FROM events WHERE aggregate_id = $1;', [id]);
  return projectElection(events);
}
