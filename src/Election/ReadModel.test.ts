import { Events } from './events';
import { project, state } from './ReadModel';
import { from } from 'rxjs';
const uuid = require('uuid/v4');

const aggregate_type = 'election';
const aggregate_id = uuid();
const date_created = new Date().toISOString();
const actor = 'test-user';

const id = aggregate_id;

const events: Events[] = [
  {
    id: uuid(),
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
    id: uuid(),
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
    id: uuid(),
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

test('simple single election', () => {
  project(from(events));
  expect(state[id].name).toBe('the name has been updated');
  expect(state[id].status).toBe('OPEN');
});
