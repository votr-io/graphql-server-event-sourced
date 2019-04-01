/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: WeakLogin
// ====================================================

export interface WeakLogin_weakLogin {
  __typename: "WeakLoginResponse";
  accessToken: string;
}

export interface WeakLogin {
  weakLogin: WeakLogin_weakLogin;
}

export interface WeakLoginVariables {
  adminToken: string;
}
