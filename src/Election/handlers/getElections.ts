import { Handler } from '../service';
import { Context } from '../../context';
import { Election } from '../types';

export const getElectionsHandler: Handler<Context, string[], Promise<Election[]>> = {
  handleRequest: async (ctx, ids) => {
    return ids.map(id => ctx.inMemoryElections[id]);
  },
};
