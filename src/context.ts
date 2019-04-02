import { BallotStore, postgresBallotStore } from './Ballot/store';
import { Claims } from './User/tokens';
import { postgresUserStore, UserStore } from './User/store';
import { ReadModel, inMemoryReadModel } from './Election/ReadModel';
import { EventStore, postgresEventStore } from './Election/EventStore';

export interface Context {
  token: string;
  claims?: Claims;

  readModel: ReadModel;
  userStore: UserStore;
  eventStore: EventStore;
  ballotStore: BallotStore;
}

export function context({ req }): Context {
  const token = req.headers['x-token'] || '';
  return {
    token,

    readModel: inMemoryReadModel,
    userStore: postgresUserStore,
    eventStore: postgresEventStore,
    ballotStore: postgresBallotStore,
  };
}
