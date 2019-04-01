/* tslint:disable */
// This file was automatically generated and should not be edited.
import ApolloClient, { QueryOptions, MutationOptions } from 'apollo-client';
import gql from 'graphql-tag';

import { CastBallot, CastBallotVariables } from './CastBallot'
import { CreateElection, CreateElectionVariables } from './CreateElection'
import { GetElections, GetElectionsVariables } from './GetElections'
import { StartElection, StartElectionVariables } from './StartElection'
import { StopElection, StopElectionVariables } from './StopElection'
import { UpdateElection, UpdateElectionVariables } from './UpdateElection'
import { WeakLogin, WeakLoginVariables } from './WeakLogin'

//can be removed if this bug is fixed:
//https://github.com/apollographql/apollo-client/issues/2795
import { ExecutionResult } from 'graphql';
declare module 'apollo-link' {
  export type FetchResult<
    TData = { [key: string]: any },
    C = Record<string, any>,
    E = Record<string, any>
  > = ExecutionResult<TData> & {
    extensions?: E;
    context?: C;
  };
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export function createService(client: ApolloClient<any>) {
  return {
    
    GetElections: (variables: GetElectionsVariables, options: Omit<QueryOptions<GetElectionsVariables>, 'query' | 'variables'> = {}) => {
      return client.query<GetElections, GetElectionsVariables>({
        ...options,
        query: GetElectionsQuery,
        variables
      });
    },
    watchGetElections: (variables: GetElectionsVariables, options: Omit<QueryOptions<GetElectionsVariables>, 'query' | 'variables'> = {}) => {
      return client.watchQuery<GetElections, GetElectionsVariables>({
        ...options,
        query: GetElectionsQuery,
        variables
      });
    },

    
    CastBallot: (variables: CastBallotVariables, options: Omit<MutationOptions<CastBallot, CastBallotVariables>, 'mutation' | 'variables'> = {}) => {
      return client.mutate<CastBallot, CastBallotVariables>({
        ...options,
        mutation: CastBallotMutation,
        variables
      });
    },

    CreateElection: (variables: CreateElectionVariables, options: Omit<MutationOptions<CreateElection, CreateElectionVariables>, 'mutation' | 'variables'> = {}) => {
      return client.mutate<CreateElection, CreateElectionVariables>({
        ...options,
        mutation: CreateElectionMutation,
        variables
      });
    },

    StartElection: (variables: StartElectionVariables, options: Omit<MutationOptions<StartElection, StartElectionVariables>, 'mutation' | 'variables'> = {}) => {
      return client.mutate<StartElection, StartElectionVariables>({
        ...options,
        mutation: StartElectionMutation,
        variables
      });
    },

    StopElection: (variables: StopElectionVariables, options: Omit<MutationOptions<StopElection, StopElectionVariables>, 'mutation' | 'variables'> = {}) => {
      return client.mutate<StopElection, StopElectionVariables>({
        ...options,
        mutation: StopElectionMutation,
        variables
      });
    },

    UpdateElection: (variables: UpdateElectionVariables, options: Omit<MutationOptions<UpdateElection, UpdateElectionVariables>, 'mutation' | 'variables'> = {}) => {
      return client.mutate<UpdateElection, UpdateElectionVariables>({
        ...options,
        mutation: UpdateElectionMutation,
        variables
      });
    },

    WeakLogin: (variables: WeakLoginVariables, options: Omit<MutationOptions<WeakLogin, WeakLoginVariables>, 'mutation' | 'variables'> = {}) => {
      return client.mutate<WeakLogin, WeakLoginVariables>({
        ...options,
        mutation: WeakLoginMutation,
        variables
      });
    },
  
  }
}


  export const CastBallotMutation = gql`mutation CastBallot($candidateIds:[ID!]!,$electionId:ID!){castBallot(input:{electionId:$electionId,candidateIds:$candidateIds})}`
  
  export const CreateElectionMutation = gql`mutation CreateElection($candidates:[CreateCandidateInput!]!,$description:String!,$email:String,$name:String!){createElection(input:{name:$name,description:$description,candidates:$candidates,email:$email}){__typename adminToken election{__typename candidates{__typename description id name}description id name results{__typename winner{__typename id name}}status statusTransitions{__typename on status}}}}`
  
  export const GetElectionsQuery = gql`query GetElections($ids:[ID!]!){getElections(input:{ids:$ids}){__typename elections{__typename candidates{__typename description id name}description id name results{__typename winner{__typename id name}}status statusTransitions{__typename on status}}}}`
  
  export const StartElectionMutation = gql`mutation StartElection($electionId:ID!){startElection(input:{electionId:$electionId}){__typename election{__typename candidates{__typename description id name}description id name results{__typename winner{__typename id name}}status statusTransitions{__typename on status}}}}`
  
  export const StopElectionMutation = gql`mutation StopElection($electionId:ID!){stopElection(input:{electionId:$electionId}){__typename election{__typename candidates{__typename description id name}description id name results{__typename winner{__typename id name}}status statusTransitions{__typename on status}}}}`
  
  export const UpdateElectionMutation = gql`mutation UpdateElection($candidates:[CreateCandidateInput!],$description:String,$electionId:ID!,$name:String){updateElection(input:{electionId:$electionId,name:$name,description:$description,candidates:$candidates}){__typename election{__typename candidates{__typename description id name}description id name results{__typename winner{__typename id name}}status statusTransitions{__typename on status}}}}`
  
  export const WeakLoginMutation = gql`mutation WeakLogin($adminToken:String!){weakLogin(input:{adminToken:$adminToken}){__typename accessToken}}`