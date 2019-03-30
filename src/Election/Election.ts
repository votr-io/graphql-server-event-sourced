import { Election } from './types';
import { Events } from './events';

export function projectElection(
  events: Events[],
  init: Partial<Election> = {}
): Election {
  let election = init;

  events.forEach(event => {
    const { date_created, actor } = event;
    switch (event.event_type) {
      case 'election_created':
        election = {
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
        election.dateUpdated = date_created;
        election.name = event.data.name;
        break;
      case 'election_description_changed':
        election.dateUpdated = date_created;
        election.description = event.data.description;
        break;
      case 'election_candidates_changed':
        election.dateUpdated = date_created;
        election.candidates = event.data.candidates;
        break;
      case 'election_started':
        election.dateUpdated = date_created;
        election.status = 'OPEN';
        election.statusTransitions.push({
          on: date_created,
          status: 'OPEN',
        });
        break;
      case 'election_stopped':
        election.dateUpdated = date_created;
        election.status = 'CLOSED';
        election.statusTransitions.push({
          on: date_created,
          status: 'CLOSED',
        });

        break;
    }
  });

  return election as Election;
}
