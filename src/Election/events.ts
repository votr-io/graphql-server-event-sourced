import { EventStore } from './EventStore';
import { Candidate } from './types';
import { Event } from './EventStore';

interface ElectionCreated extends Event {
  event_type: 'election_created';
  aggregate_type: 'election';
  data: {
    id: string;
    name: string;
    description: string;
    candidates: Candidate[];
  };
}

interface ElectionNameChanged extends Event {
  event_type: 'election_name_changed';
  aggregate_type: 'election';
  data: {
    id: string;
    name: string;
  };
}

interface ElectionDescriptionChanged extends Event {
  event_type: 'election_description_changed';
  aggregate_type: 'election';
  data: {
    id: string;
    description: string;
  };
}

interface ElectionCandidatesChanged extends Event {
  event_type: 'election_candidates_changed';
  aggregate_type: 'election';
  data: {
    id: string;
    candidates: Candidate[];
  };
}

interface ElectionStarted extends Event {
  event_type: 'election_started';
  aggregate_type: 'election';
  data: {
    id: string;
  };
}

interface ElectionStopped extends Event {
  event_type: 'election_stopped';
  aggregate_type: 'election';
  data: {
    id: string;
  };
}

export type Events =
  | ElectionCreated
  | ElectionNameChanged
  | ElectionDescriptionChanged
  | ElectionCandidatesChanged
  | ElectionStarted
  | ElectionStopped;
