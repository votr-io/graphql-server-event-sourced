export type Maybe<T> = T | null;

export interface GetElectionsRequest {
  ids: string[];
}

export interface CreateElectionRequest {
  name: string;

  description: string;

  candidates: CreateCandidateInput[];

  email?: Maybe<string>;
}

export interface CreateCandidateInput {
  id?: Maybe<string>;

  name: string;

  description?: Maybe<string>;
}

export interface DeleteElectionsRequest {
  ids: string[];
}
/** updateElection is used to modify an election when it is in the PENDING status. Once an election has entered any other status, it's configuration is frozen. TODO: add properties here like public/private, manual/scheduled start/end dates */
export interface UpdateElectionRequest {
  id: string;

  name?: Maybe<string>;

  description?: Maybe<string>;

  candidates?: Maybe<CreateCandidateInput[]>;
}

export interface StartElectionRequest {
  id: string;
}

export interface StopElectionRequest {
  id: string;
}

export interface WeakLoginRequest {
  adminToken: string;
}

export interface SubmitBallotRequest {
  electionId: string;

  candidateIds: string[];
}

export interface AddCandidatesRequest {
  electionId: string;

  candidates: CreateCandidateInput[];
}

export interface RemoveCandidatesRequest {
  electionId: string;

  candidateIds: string[];
}
/** Possible statuses an election can be in. Transitions only go in one direction.  There's no going back. */
export enum ElectionStatus {
  Pending = 'PENDING',
  Open = 'OPEN',
  Tallying = 'TALLYING',
  Closed = 'CLOSED',
}

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
}

/** The `Upload` scalar type represents a file upload. */
export type Upload = any;

// ====================================================
// Scalars
// ====================================================

// ====================================================
// Types
// ====================================================

export interface Query {
  getElections: GetElectionsResponse;
}

export interface GetElectionsResponse {
  elections: Election[];
}

/** An election. */
export interface Election {
  id: string;

  name: string;

  description: string;

  dateUpdated: string;

  candidates: Candidate[];

  status: ElectionStatus;

  statusTransitions: ElectionStatusTransition[];

  results?: Maybe<Results>;
}

/** A candidate in a specific election. */
export interface Candidate {
  id: string;

  name: string;

  description?: Maybe<string>;
}

/** Represents the dateTime an election moved into a specific status. */
export interface ElectionStatusTransition {
  on: string;

  status: ElectionStatus;
}

/** The winner of the election and all of the data needed to show how the election was won. */
export interface Results {
  winner: Candidate;

  replay: Round[];
}

/** Information about a specific round of an election. If this is the final round of the election, redistribution will be null, candidateTotals - the number of votes each candidate is awarded this round redistribution - the number of votes being redistributed to each candidate (does not include the last place candidate for this round) */
export interface Round {
  candidateTotals: CandidateVotes[];

  redistribution?: Maybe<(Maybe<CandidateVotes>)[]>;
}

/** Votes associated with a candidate. Can be used for: - number of votes a candidate recieved in a round - number of votes being redistributed to a candidate in the event there's more than one round Note: if canditate is null, that means that these votes no longer have a valid candidate to count towards (all the candidates on these ballots have been dropped from the election due to being in last place in previous rounds) */
export interface CandidateVotes {
  candidate?: Maybe<Candidate>;

  votes: number;
}

export interface Mutation {
  createElection: CreateElectionResponse;

  deleteElections: boolean;

  updateElection: UpdateElectionResponse;

  startElection: StartElectionResponse;

  stopElection: StopElectionResponse;

  weakLogin: WeakLoginResponse;

  castBallot: boolean;
}

export interface CreateElectionResponse {
  election: Election;

  adminToken?: Maybe<string>;
}

export interface UpdateElectionResponse {
  election: Election;
}

export interface StartElectionResponse {
  election: Election;
}

export interface StopElectionResponse {
  election: Election;
}

export interface WeakLoginResponse {
  accessToken: string;
}

export interface AddCandidatesResponse {
  election: Election;
}

export interface RemoveCandidatesResponse {
  election: Election;
}

export interface User {
  id: string;

  email: string;
}

// ====================================================
// Arguments
// ====================================================

export interface GetElectionsQueryArgs {
  input: GetElectionsRequest;
}
export interface CreateElectionMutationArgs {
  input: CreateElectionRequest;
}
export interface DeleteElectionsMutationArgs {
  input: DeleteElectionsRequest;
}
export interface UpdateElectionMutationArgs {
  input: UpdateElectionRequest;
}
export interface StartElectionMutationArgs {
  input: StartElectionRequest;
}
export interface StopElectionMutationArgs {
  input: StopElectionRequest;
}
export interface WeakLoginMutationArgs {
  input: WeakLoginRequest;
}
export interface CastBallotMutationArgs {
  input: SubmitBallotRequest;
}

import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';

import { Election } from '../../Election/types';

export type Resolver<Result, Parent = {}, Context = {}, Args = {}> = (
  parent: Parent,
  args: Args,
  context: Context,
  info: GraphQLResolveInfo
) => Promise<Result> | Result;

export interface ISubscriptionResolverObject<Result, Parent, Context, Args> {
  subscribe<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo
  ): AsyncIterator<R | Result> | Promise<AsyncIterator<R | Result>>;
  resolve?<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo
  ): R | Result | Promise<R | Result>;
}

export type SubscriptionResolver<Result, Parent = {}, Context = {}, Args = {}> =
  | ((...args: any[]) => ISubscriptionResolverObject<Result, Parent, Context, Args>)
  | ISubscriptionResolverObject<Result, Parent, Context, Args>;

export type TypeResolveFn<Types, Parent = {}, Context = {}> = (
  parent: Parent,
  context: Context,
  info: GraphQLResolveInfo
) => Maybe<Types>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult, TArgs = {}, TContext = {}> = (
  next: NextResolverFn<TResult>,
  source: any,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export namespace QueryResolvers {
  export interface Resolvers<Context = {}, TypeParent = {}> {
    getElections?: GetElectionsResolver<GetElectionsResponse, TypeParent, Context>;
  }

  export type GetElectionsResolver<
    R = GetElectionsResponse,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, GetElectionsArgs>;
  export interface GetElectionsArgs {
    input: GetElectionsRequest;
  }
}

export namespace GetElectionsResponseResolvers {
  export interface Resolvers<Context = {}, TypeParent = GetElectionsResponse> {
    elections?: ElectionsResolver<Election[], TypeParent, Context>;
  }

  export type ElectionsResolver<
    R = Election[],
    Parent = GetElectionsResponse,
    Context = {}
  > = Resolver<R, Parent, Context>;
}
/** An election. */
export namespace ElectionResolvers {
  export interface Resolvers<Context = {}, TypeParent = Election> {
    id?: IdResolver<string, TypeParent, Context>;

    name?: NameResolver<string, TypeParent, Context>;

    description?: DescriptionResolver<string, TypeParent, Context>;

    dateUpdated?: DateUpdatedResolver<string, TypeParent, Context>;

    candidates?: CandidatesResolver<Candidate[], TypeParent, Context>;

    status?: StatusResolver<ElectionStatus, TypeParent, Context>;

    statusTransitions?: StatusTransitionsResolver<
      ElectionStatusTransition[],
      TypeParent,
      Context
    >;

    results?: ResultsResolver<Maybe<Results>, TypeParent, Context>;
  }

  export type IdResolver<R = string, Parent = Election, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type NameResolver<R = string, Parent = Election, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type DescriptionResolver<R = string, Parent = Election, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type DateUpdatedResolver<R = string, Parent = Election, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type CandidatesResolver<
    R = Candidate[],
    Parent = Election,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type StatusResolver<
    R = ElectionStatus,
    Parent = Election,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type StatusTransitionsResolver<
    R = ElectionStatusTransition[],
    Parent = Election,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ResultsResolver<
    R = Maybe<Results>,
    Parent = Election,
    Context = {}
  > = Resolver<R, Parent, Context>;
}
/** A candidate in a specific election. */
export namespace CandidateResolvers {
  export interface Resolvers<Context = {}, TypeParent = Candidate> {
    id?: IdResolver<string, TypeParent, Context>;

    name?: NameResolver<string, TypeParent, Context>;

    description?: DescriptionResolver<Maybe<string>, TypeParent, Context>;
  }

  export type IdResolver<R = string, Parent = Candidate, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type NameResolver<R = string, Parent = Candidate, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type DescriptionResolver<
    R = Maybe<string>,
    Parent = Candidate,
    Context = {}
  > = Resolver<R, Parent, Context>;
}
/** Represents the dateTime an election moved into a specific status. */
export namespace ElectionStatusTransitionResolvers {
  export interface Resolvers<Context = {}, TypeParent = ElectionStatusTransition> {
    on?: OnResolver<string, TypeParent, Context>;

    status?: StatusResolver<ElectionStatus, TypeParent, Context>;
  }

  export type OnResolver<
    R = string,
    Parent = ElectionStatusTransition,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type StatusResolver<
    R = ElectionStatus,
    Parent = ElectionStatusTransition,
    Context = {}
  > = Resolver<R, Parent, Context>;
}
/** The winner of the election and all of the data needed to show how the election was won. */
export namespace ResultsResolvers {
  export interface Resolvers<Context = {}, TypeParent = Results> {
    winner?: WinnerResolver<Candidate, TypeParent, Context>;

    replay?: ReplayResolver<Round[], TypeParent, Context>;
  }

  export type WinnerResolver<R = Candidate, Parent = Results, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type ReplayResolver<R = Round[], Parent = Results, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
}
/** Information about a specific round of an election. If this is the final round of the election, redistribution will be null, candidateTotals - the number of votes each candidate is awarded this round redistribution - the number of votes being redistributed to each candidate (does not include the last place candidate for this round) */
export namespace RoundResolvers {
  export interface Resolvers<Context = {}, TypeParent = Round> {
    candidateTotals?: CandidateTotalsResolver<CandidateVotes[], TypeParent, Context>;

    redistribution?: RedistributionResolver<
      Maybe<(Maybe<CandidateVotes>)[]>,
      TypeParent,
      Context
    >;
  }

  export type CandidateTotalsResolver<
    R = CandidateVotes[],
    Parent = Round,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type RedistributionResolver<
    R = Maybe<(Maybe<CandidateVotes>)[]>,
    Parent = Round,
    Context = {}
  > = Resolver<R, Parent, Context>;
}
/** Votes associated with a candidate. Can be used for: - number of votes a candidate recieved in a round - number of votes being redistributed to a candidate in the event there's more than one round Note: if canditate is null, that means that these votes no longer have a valid candidate to count towards (all the candidates on these ballots have been dropped from the election due to being in last place in previous rounds) */
export namespace CandidateVotesResolvers {
  export interface Resolvers<Context = {}, TypeParent = CandidateVotes> {
    candidate?: CandidateResolver<Maybe<Candidate>, TypeParent, Context>;

    votes?: VotesResolver<number, TypeParent, Context>;
  }

  export type CandidateResolver<
    R = Maybe<Candidate>,
    Parent = CandidateVotes,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type VotesResolver<R = number, Parent = CandidateVotes, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
}

export namespace MutationResolvers {
  export interface Resolvers<Context = {}, TypeParent = {}> {
    createElection?: CreateElectionResolver<CreateElectionResponse, TypeParent, Context>;

    deleteElections?: DeleteElectionsResolver<boolean, TypeParent, Context>;

    updateElection?: UpdateElectionResolver<UpdateElectionResponse, TypeParent, Context>;

    startElection?: StartElectionResolver<StartElectionResponse, TypeParent, Context>;

    stopElection?: StopElectionResolver<StopElectionResponse, TypeParent, Context>;

    weakLogin?: WeakLoginResolver<WeakLoginResponse, TypeParent, Context>;

    castBallot?: CastBallotResolver<boolean, TypeParent, Context>;
  }

  export type CreateElectionResolver<
    R = CreateElectionResponse,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, CreateElectionArgs>;
  export interface CreateElectionArgs {
    input: CreateElectionRequest;
  }

  export type DeleteElectionsResolver<R = boolean, Parent = {}, Context = {}> = Resolver<
    R,
    Parent,
    Context,
    DeleteElectionsArgs
  >;
  export interface DeleteElectionsArgs {
    input: DeleteElectionsRequest;
  }

  export type UpdateElectionResolver<
    R = UpdateElectionResponse,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, UpdateElectionArgs>;
  export interface UpdateElectionArgs {
    input: UpdateElectionRequest;
  }

  export type StartElectionResolver<
    R = StartElectionResponse,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, StartElectionArgs>;
  export interface StartElectionArgs {
    input: StartElectionRequest;
  }

  export type StopElectionResolver<
    R = StopElectionResponse,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, StopElectionArgs>;
  export interface StopElectionArgs {
    input: StopElectionRequest;
  }

  export type WeakLoginResolver<
    R = WeakLoginResponse,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, WeakLoginArgs>;
  export interface WeakLoginArgs {
    input: WeakLoginRequest;
  }

  export type CastBallotResolver<R = boolean, Parent = {}, Context = {}> = Resolver<
    R,
    Parent,
    Context,
    CastBallotArgs
  >;
  export interface CastBallotArgs {
    input: SubmitBallotRequest;
  }
}

export namespace CreateElectionResponseResolvers {
  export interface Resolvers<Context = {}, TypeParent = CreateElectionResponse> {
    election?: ElectionResolver<Election, TypeParent, Context>;

    adminToken?: AdminTokenResolver<Maybe<string>, TypeParent, Context>;
  }

  export type ElectionResolver<
    R = Election,
    Parent = CreateElectionResponse,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type AdminTokenResolver<
    R = Maybe<string>,
    Parent = CreateElectionResponse,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace UpdateElectionResponseResolvers {
  export interface Resolvers<Context = {}, TypeParent = UpdateElectionResponse> {
    election?: ElectionResolver<Election, TypeParent, Context>;
  }

  export type ElectionResolver<
    R = Election,
    Parent = UpdateElectionResponse,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace StartElectionResponseResolvers {
  export interface Resolvers<Context = {}, TypeParent = StartElectionResponse> {
    election?: ElectionResolver<Election, TypeParent, Context>;
  }

  export type ElectionResolver<
    R = Election,
    Parent = StartElectionResponse,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace StopElectionResponseResolvers {
  export interface Resolvers<Context = {}, TypeParent = StopElectionResponse> {
    election?: ElectionResolver<Election, TypeParent, Context>;
  }

  export type ElectionResolver<
    R = Election,
    Parent = StopElectionResponse,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace WeakLoginResponseResolvers {
  export interface Resolvers<Context = {}, TypeParent = WeakLoginResponse> {
    accessToken?: AccessTokenResolver<string, TypeParent, Context>;
  }

  export type AccessTokenResolver<
    R = string,
    Parent = WeakLoginResponse,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace AddCandidatesResponseResolvers {
  export interface Resolvers<Context = {}, TypeParent = AddCandidatesResponse> {
    election?: ElectionResolver<Election, TypeParent, Context>;
  }

  export type ElectionResolver<
    R = Election,
    Parent = AddCandidatesResponse,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace RemoveCandidatesResponseResolvers {
  export interface Resolvers<Context = {}, TypeParent = RemoveCandidatesResponse> {
    election?: ElectionResolver<Election, TypeParent, Context>;
  }

  export type ElectionResolver<
    R = Election,
    Parent = RemoveCandidatesResponse,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace UserResolvers {
  export interface Resolvers<Context = {}, TypeParent = User> {
    id?: IdResolver<string, TypeParent, Context>;

    email?: EmailResolver<string, TypeParent, Context>;
  }

  export type IdResolver<R = string, Parent = User, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type EmailResolver<R = string, Parent = User, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
}

export type CacheControlDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  CacheControlDirectiveArgs,
  {}
>;
export interface CacheControlDirectiveArgs {
  maxAge?: Maybe<number>;

  scope?: Maybe<CacheControlScope>;
}

/** Directs the executor to skip this field or fragment when the `if` argument is true. */
export type SkipDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  SkipDirectiveArgs,
  {}
>;
export interface SkipDirectiveArgs {
  /** Skipped when true. */
  if: boolean;
}

/** Directs the executor to include this field or fragment only when the `if` argument is true. */
export type IncludeDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  IncludeDirectiveArgs,
  {}
>;
export interface IncludeDirectiveArgs {
  /** Included when true. */
  if: boolean;
}

/** Marks an element of a GraphQL schema as no longer supported. */
export type DeprecatedDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  DeprecatedDirectiveArgs,
  {}
>;
export interface DeprecatedDirectiveArgs {
  /** Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax (as specified by [CommonMark](https://commonmark.org/). */
  reason?: string;
}

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<Upload, any> {
  name: 'Upload';
}

export interface IResolvers<Context = {}> {
  Query?: QueryResolvers.Resolvers<Context>;
  GetElectionsResponse?: GetElectionsResponseResolvers.Resolvers<Context>;
  Election?: ElectionResolvers.Resolvers<Context>;
  Candidate?: CandidateResolvers.Resolvers<Context>;
  ElectionStatusTransition?: ElectionStatusTransitionResolvers.Resolvers<Context>;
  Results?: ResultsResolvers.Resolvers<Context>;
  Round?: RoundResolvers.Resolvers<Context>;
  CandidateVotes?: CandidateVotesResolvers.Resolvers<Context>;
  Mutation?: MutationResolvers.Resolvers<Context>;
  CreateElectionResponse?: CreateElectionResponseResolvers.Resolvers<Context>;
  UpdateElectionResponse?: UpdateElectionResponseResolvers.Resolvers<Context>;
  StartElectionResponse?: StartElectionResponseResolvers.Resolvers<Context>;
  StopElectionResponse?: StopElectionResponseResolvers.Resolvers<Context>;
  WeakLoginResponse?: WeakLoginResponseResolvers.Resolvers<Context>;
  AddCandidatesResponse?: AddCandidatesResponseResolvers.Resolvers<Context>;
  RemoveCandidatesResponse?: RemoveCandidatesResponseResolvers.Resolvers<Context>;
  User?: UserResolvers.Resolvers<Context>;
  Upload?: GraphQLScalarType;
}

export interface IDirectiveResolvers<Result> {
  cacheControl?: CacheControlDirectiveResolver<Result>;
  skip?: SkipDirectiveResolver<Result>;
  include?: IncludeDirectiveResolver<Result>;
  deprecated?: DeprecatedDirectiveResolver<Result>;
}
