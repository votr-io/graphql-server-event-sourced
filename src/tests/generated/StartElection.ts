/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ElectionStatus } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: StartElection
// ====================================================

export interface StartElection_startElection_election_candidates {
  __typename: "Candidate";
  id: string;
  name: string;
  description: string | null;
}

export interface StartElection_startElection_election_statusTransitions {
  __typename: "ElectionStatusTransition";
  on: string;
  status: ElectionStatus;
}

export interface StartElection_startElection_election_results_winner {
  __typename: "Candidate";
  id: string;
  name: string;
}

export interface StartElection_startElection_election_results {
  __typename: "Results";
  winner: StartElection_startElection_election_results_winner;
}

export interface StartElection_startElection_election {
  __typename: "Election";
  id: string;
  name: string;
  description: string;
  candidates: StartElection_startElection_election_candidates[];
  status: ElectionStatus;
  statusTransitions: StartElection_startElection_election_statusTransitions[];
  results: StartElection_startElection_election_results | null;
}

export interface StartElection_startElection {
  __typename: "StartElectionResponse";
  election: StartElection_startElection_election;
}

export interface StartElection {
  startElection: StartElection_startElection;
}

export interface StartElectionVariables {
  id: string;
}
