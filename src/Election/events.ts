import { Candidate, Results } from './types';
import { Event } from './EventStore';

export interface ElectionCreated extends Event {
  event_type: 'election_created';
  aggregate_type: 'election';
  data: {
    id: string;
    name: string;
    description: string;
    candidates: Candidate[];
  };
}

export interface ElectionNameChanged extends Event {
  event_type: 'election_name_changed';
  aggregate_type: 'election';
  data: {
    id: string;
    name: string;
  };
}

export interface ElectionDescriptionChanged extends Event {
  event_type: 'election_description_changed';
  aggregate_type: 'election';
  data: {
    id: string;
    description: string;
  };
}

export interface ElectionCandidatesChanged extends Event {
  event_type: 'election_candidates_changed';
  aggregate_type: 'election';
  data: {
    id: string;
    candidates: Candidate[];
  };
}

export interface ElectionStarted extends Event {
  event_type: 'election_started';
  aggregate_type: 'election';
  data: {
    id: string;
  };
}

export interface ElectionStopped extends Event {
  event_type: 'election_stopped';
  aggregate_type: 'election';
  data: {
    id: string;
  };
}

export interface VotesCounted extends Event {
  event_type: 'votes_counted';
  aggregate_type: 'election';
  data: {
    results: Results;
  };
}

export type Events =
  | ElectionCreated
  | ElectionNameChanged
  | ElectionDescriptionChanged
  | ElectionCandidatesChanged
  | ElectionStarted
  | ElectionStopped
  | VotesCounted;
