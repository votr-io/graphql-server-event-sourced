import { postgresUserStore, UserStore } from './User/store';
import { ElectionService, electionService } from './Election/service';
import { ReadModel, inMemoryElections, project } from './Election/ReadModel';
import { EventStore, postgresEventStore } from './Election/EventStore';

export interface Context {
  token: string;
  electionService: ElectionService;
  inMemoryElections: ReadModel;
  userStore: UserStore;
  eventStore: EventStore;
}

project(postgresEventStore.stream());

export function context({ req }): Context {
  const token = req.headers['x-token'] || '';
  return {
    token,
    electionService,
    inMemoryElections,
    userStore: postgresUserStore,
    eventStore: postgresEventStore,
  };
}
