import * as jwt from 'jsonwebtoken';
import { ENV } from '../env';

const Cryptr = require('cryptr');

export type Claims = WeakClaims;

export interface WeakClaims {
  userId: string;
  electionId: string;
}
export function sign(claims: Claims): string {
  return jwt.sign(claims, ENV.TOKEN_SECRET);
}

export function validate(token: string): Claims {
  try {
    return jwt.verify(token, ENV.TOKEN_SECRET) as Claims;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export function isWeakClaims(claims: Claims): claims is WeakClaims {
  return 'electionId' in claims;
}

const cryptr = new Cryptr(ENV.TOKEN_SECRET);

export interface AdminToken {
  userId: string;
  electionId: string;
}

export function encryptAdminToken(adminToken: AdminToken): string {
  return cryptr.encrypt(JSON.stringify(adminToken));
}

export function descryptAdminToken(s: string): AdminToken {
  return JSON.parse(cryptr.decrypt(s));
}
