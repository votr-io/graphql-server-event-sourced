import { Context } from '../../context';

import { Handler, useHandler } from '../../lib/handler';
import { getResults, ElectionResults } from 'alt-vote';

const handler: Handler<
  Context,
  {
    electionId: string;
  },
  Promise<ElectionResults>
> = {
  validate,
  handleRequest: async (ctx, { electionId }) => {
    const results = await getResults({
      fetchBallots: () => ctx.ballotStore.streamBallots(electionId),
    });
    return results;
  },
};

function validate(input: { electionId: string }): string {
  const errors = [];
  const { electionId } = input;
  if (!electionId || electionId == '') {
    errors.push(`electionId is required`);
  }
  if (errors.length > 0) {
    return errors.join(', ');
  }
  return null;
}

export default useHandler(handler);
