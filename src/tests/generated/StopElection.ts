/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ElectionStatus } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: StopElection
// ====================================================

export interface StopElection_stopElection_election_candidates {
  __typename: "Candidate";
  id: string;
  name: string;
  description: string | null;
}

export interface StopElection_stopElection_election_statusTransitions {
  __typename: "ElectionStatusTransition";
  on: string;
  status: ElectionStatus;
}

export interface StopElection_stopElection_election_results_winner {
  __typename: "Candidate";
  id: string;
  name: string;
}

export interface StopElection_stopElection_election_results {
  __typename: "Results";
  winner: StopElection_stopElection_election_results_winner;
}

export interface StopElection_stopElection_election {
  __typename: "Election";
  id: string;
  name: string;
  description: string;
  candidates: StopElection_stopElection_election_candidates[];
  status: ElectionStatus;
  statusTransitions: StopElection_stopElection_election_statusTransitions[];
  results: StopElection_stopElection_election_results | null;
}

export interface StopElection_stopElection {
  __typename: "StopElectionResponse";
  election: StopElection_stopElection_election;
}

export interface StopElection {
  stopElection: StopElection_stopElection;
}

export interface StopElectionVariables {
  id: string;
}
