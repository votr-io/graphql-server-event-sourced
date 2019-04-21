import { gql } from 'apollo-server-core';

export const typeDefs = gql`
  type Query {
    listElections(input: ListElectionsRequest!): ListElectionsResponse!
    getElections(input: GetElectionsRequest!): GetElectionsResponse!
  }
  type Mutation {
    createElection(input: CreateElectionRequest!): CreateElectionResponse!
    deleteElections(input: DeleteElectionsRequest!): Boolean!
    updateElection(input: UpdateElectionRequest!): UpdateElectionResponse!

    startElection(input: StartElectionRequest!): StartElectionResponse!
    stopElection(input: StopElectionRequest!): StopElectionResponse!

    weakLogin(input: WeakLoginRequest!): WeakLoginResponse!

    castBallot(input: SubmitBallotRequest!): Boolean!
    #addRegistrations (this should probably be allowed in both PENDING and ACTIVE)
    #removeRegistrations (this should probably be allowed only in PENDING)
  }

  input ListElectionsRequest {
    _: Boolean
  }
  type ListElectionsResponse {
    elections: [Election!]!
  }

  input GetElectionsRequest {
    ids: [ID!]!
  }
  type GetElectionsResponse {
    elections: [Election!]!
  }

  input CreateElectionRequest {
    name: String!
    description: String!
    candidates: [CreateCandidateInput!]!
    email: String
  }
  input CreateCandidateInput {
    id: ID
    name: String!
    description: String
  }
  type CreateElectionResponse {
    election: Election!
    adminToken: String
  }

  input DeleteElectionsRequest {
    ids: [ID!]!
  }

  """
  updateElection is used to modify an election when it is in the PENDING status.
  Once an election has entered any other status, it's configuration is frozen.
  TODO: add properties here like public/private, manual/scheduled start/end dates
  """
  input UpdateElectionRequest {
    id: ID!
    name: String
    description: String
    candidates: [CreateCandidateInput!]
  }
  type UpdateElectionResponse {
    election: Election!
  }

  input AddCandidatesRequest {
    electionId: ID!
    candidates: [CreateCandidateInput!]!
  }
  type AddCandidatesResponse {
    election: Election!
  }

  input RemoveCandidatesRequest {
    electionId: ID!
    candidateIds: [ID!]!
  }
  type RemoveCandidatesResponse {
    election: Election!
  }

  input StartElectionRequest {
    id: ID!
  }
  type StartElectionResponse {
    election: Election!
  }

  input StopElectionRequest {
    id: ID!
  }
  type StopElectionResponse {
    election: Election!
  }

  input WeakLoginRequest {
    adminToken: String!
  }
  type WeakLoginResponse {
    accessToken: String!
  }

  input SubmitBallotRequest {
    electionId: ID!
    candidateIds: [ID!]!
  }

  type User {
    id: String!
    email: String!
  }

  """
  Possible statuses an election can be in.
  Transitions only go in one direction.  There's no going back.
  """
  enum ElectionStatus {
    PENDING
    OPEN
    TALLYING
    CLOSED
  }

  """
  Represents the dateTime an election moved into a specific status.
  """
  type ElectionStatusTransition {
    on: String!
    status: ElectionStatus!
  }

  """
  An election.
  """
  type Election {
    id: ID!
    name: String!
    description: String!
    dateUpdated: String!
    candidates: [Candidate!]!
    status: ElectionStatus!
    statusTransitions: [ElectionStatusTransition!]!
    results: Results
  }

  """
  A candidate in a specific election.
  """
  type Candidate {
    id: ID!
    name: String!
    description: String
  }

  """
  The winner of the election and all of the data needed to show how the election was won.
  """
  type Results {
    winner: Candidate!
    replay: [Round!]!
  }

  """
  Information about a specific round of an election.
  If this is the final round of the election, redistribution will be null,
    candidateTotals - the number of votes each candidate is awarded this round
    redistribution - the number of votes being redistributed to each candidate (does not include the last place candidate for this round)
  """
  type Round {
    candidateTotals: [CandidateVotes!]!
    redistribution: [CandidateVotes]
  }

  """
  Votes associated with a candidate.
  Can be used for:
    - number of votes a candidate recieved in a round
    - number of votes being redistributed to a candidate in the event there's more than one round

  Note: if canditate is null, that means that these votes no longer have a valid candidate to count towards (all the candidates on these ballots have been dropped from the election due to being in last place in previous rounds)
  """
  type CandidateVotes {
    candidate: Candidate
    votes: Int!
  }
`;
