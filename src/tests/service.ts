import { createClient } from './client';
import { createService } from './generated/serviceFactory';

const uri = 'http://localhost:5000/graphql';
// const uri = 'https://votr-graphql.herokuapp.com/graphql';

export const client = createClient({ uri });
export const service = createService(client);

export function createServiceWithAccessToken(token: string) {
  return createService(createClient({ uri, token }));
}
