import { Observable } from 'rxjs';
import { isObject } from 'util';
import { IMain, IDatabase } from 'pg-promise';
import * as pgPromise from 'pg-promise';
import { ENV } from '../env';
import { Events } from './events';

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
  create(event: WithoutId<Events>): Promise<void>;
  stream(): Observable<Events>;
}

const pgp: IMain = pgPromise({
  // Initialization Options
});

export const db: IDatabase<any> = pgp(ENV.DATABASE_URL);

export const postgresEventStore: EventStore = {
  create: async event => {
    const [columns, values] = columnsAndValues(event);
    const query = `INSERT INTO events(event_type, aggregate_type, aggregate_id, date_created, actor, data) VALUES(${columns.join(
      ', '
    )});`;
    await db.none(query, values);
  },
  stream: () => {
    return new Observable<Events>(observer => {
      //This is a crazy naive implimentation of how to stream events

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

//this is pretty dumb
function columnsAndValues(o: Object): [string[], Object] {
  const keys = Object.keys(o);
  const values = keys.reduce((acc, key) => {
    const value = o[key];
    acc[key] = isObject(value) ? JSON.stringify(value) : value;
    return acc;
  }, {});
  return [keys.map(key => `$(${key})`), values];
}
