import { IMain, IDatabase } from 'pg-promise';
import * as pgPromise from 'pg-promise';
import { ENV } from './env';
import { isObject } from 'util';
import * as express from 'express';
import * as cors from 'cors';

const uuid = require('uuid/v4');

const todos: Record<string, Todo> = {};

const pgp: IMain = pgPromise({
  // Initialization Options
});

export const db: IDatabase<any> = pgp(ENV.DATABASE_URL);

db.connect().then(async connection => {
  console.log('getting past events....');

  const events: DbEvent[] = await connection.any('SELECT * FROM events;');
  events.forEach(event => {
    const todo = event.data as Todo;
    todos[todo.id] = todo;
  });

  console.log('listening for new events....');
  connection.client.on('notification', msg => {
    const event = JSON.parse(msg.payload);
    const todo: Todo = event.data;
    todos[todo.id] = todo;
  });
  connection.none('LISTEN new_event');
});

console.log('started...');

interface DbEvent {
  id: string;
  event_type: string;
  aggregate_type: string;
  aggregate_id: string;
  aggregate_new: boolean;
  date_created: string;
  transaction_id: string;
  data: object;
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

setInterval(async () => {
  const todo: Todo = {
    id: uuid(),
    text: 'this sure is a new todo',
    completed: false,
  };

  const todoCreatedEvent: DbEvent = {
    id: uuid(),
    event_type: 'todo_created',
    aggregate_type: 'todo',
    aggregate_id: todo.id,
    aggregate_new: true,
    date_created: new Date().toISOString(),
    transaction_id: uuid(),
    data: todo,
  };

  console.log(`creating todo ${todo.id}`);

  const [columns, values] = columnsAndValues(todoCreatedEvent);
  const query = `INSERT INTO events VALUES(${columns.join(', ')});`;
  await db.none(query, values);
}, 2);

function columnsAndValues(o: Object): [string[], Object] {
  const keys = Object.keys(o);
  const values = keys.reduce((acc, key) => {
    const value = o[key];
    acc[key] = isObject(value) ? JSON.stringify(value) : value;
    return acc;
  }, {});
  return [keys.map(key => `$(${key})`), values];
}

const app = express();
app.use(cors());

app.use('/todos/:id', (req, res) => {
  const id = req.params.id;
  res.json({ todo: todos[id] });
});

app.use('/todos', (req, res) => {
  res.json({ todos });
});

app.listen({ port: ENV.PORT }, () => {
  console.log(`Apollo Server listening at :${ENV.PORT}...`);
});
