import { Events } from './Election/events';
import { project, inMemoryElections } from './Election/ReadModel';
import { from } from 'rxjs';
import { postgresEventStore, WithoutId } from './Election/EventStore';
const uuid = require('uuid/v4');

const aggregate_type = 'election';
const aggregate_id = uuid();
const date_created = new Date().toISOString();
const actor = 'test-user';

const id = aggregate_id;

const events: WithoutId<Events>[] = [
  {
    event_type: 'election_created',
    aggregate_type,
    aggregate_id,
    date_created,
    actor,
    data: {
      id,
      name: 'test election',
      description: 'this sure is a test election',
      candidates: [
        {
          id: uuid(),
          name: 'Gorilla',
          description: '',
        },
        {
          id: uuid(),
          name: 'Tiger',
          description: '',
        },
      ],
    },
  },
  {
    event_type: 'election_name_changed',
    aggregate_type,
    aggregate_id,
    date_created,
    actor,
    data: {
      id,
      name: 'the name has been updated',
    },
  },
  {
    event_type: 'election_started',
    aggregate_type,
    aggregate_id,
    date_created,
    actor,
    data: {
      id,
    },
  },
];
setInterval(() => {
  console.log('creating a round of events...');
  events.forEach(event => {
    postgresEventStore.create(event);
  });
}, 2000);

// postgresEventStore.stream().subscribe(console.log);
project(postgresEventStore.stream());

import * as express from 'express';
import * as cors from 'cors';
import { ENV } from './env';

const app = express();
app.use(cors());

app.use('/election/:id', (req, res) => {
  const id = req.params.id;
  res.json({ election: inMemoryElections[id] });
});

app.use('/todos', (req, res) => {
  res.json({ inMemoryElections });
});

app.listen({ port: ENV.PORT }, () => {
  console.log(`Apollo Server listening at :${ENV.PORT}...`);
});
