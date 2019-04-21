/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ElectionStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: ListElections
// ====================================================

export interface ListElections_listElections_elections_candidates {
  __typename: "Candidate";
  id: string;
  name: string;
  description: string | null;
}

export interface ListElections_listElections_elections_statusTransitions {
  __typename: "ElectionStatusTransition";
  on: string;
  status: ElectionStatus;
}

export interface ListElections_listElections_elections_results_winner {
  __typename: "Candidate";
  id: string;
  name: string;
}

export interface ListElections_listElections_elections_results {
  __typename: "Results";
  winner: ListElections_listElections_elections_results_winner;
}

export interface ListElections_listElections_elections {
  __typename: "Election";
  id: string;
  name: string;
  description: string;
  candidates: ListElections_listElections_elections_candidates[];
  status: ElectionStatus;
  statusTransitions: ListElections_listElections_elections_statusTransitions[];
  results: ListElections_listElections_elections_results | null;
}

export interface ListElections_listElections {
  __typename: "ListElectionsResponse";
  elections: ListElections_listElections_elections[];
}

export interface ListElections {
  listElections: ListElections_listElections;
}
