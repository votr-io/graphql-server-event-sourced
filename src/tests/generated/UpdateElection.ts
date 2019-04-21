/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CreateCandidateInput, ElectionStatus } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateElection
// ====================================================

export interface UpdateElection_updateElection_election_candidates {
  __typename: "Candidate";
  id: string;
  name: string;
  description: string | null;
}

export interface UpdateElection_updateElection_election_statusTransitions {
  __typename: "ElectionStatusTransition";
  on: string;
  status: ElectionStatus;
}

export interface UpdateElection_updateElection_election_results_winner {
  __typename: "Candidate";
  id: string;
  name: string;
}

export interface UpdateElection_updateElection_election_results {
  __typename: "Results";
  winner: UpdateElection_updateElection_election_results_winner;
}

export interface UpdateElection_updateElection_election {
  __typename: "Election";
  id: string;
  name: string;
  description: string;
  candidates: UpdateElection_updateElection_election_candidates[];
  status: ElectionStatus;
  statusTransitions: UpdateElection_updateElection_election_statusTransitions[];
  results: UpdateElection_updateElection_election_results | null;
}

export interface UpdateElection_updateElection {
  __typename: "UpdateElectionResponse";
  election: UpdateElection_updateElection_election;
}

export interface UpdateElection {
  updateElection: UpdateElection_updateElection;
}

export interface UpdateElectionVariables {
  id: string;
  name?: string | null;
  description?: string | null;
  candidates?: CreateCandidateInput[] | null;
}
