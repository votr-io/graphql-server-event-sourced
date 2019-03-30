import { Context } from '../../context';

import * as tokens from '../../User/tokens';

export async function deleteElections(ctx: Context, ids: string[]): Promise<void> {
  //   const claims = tokens.validate(ctx.token);

  //   const elections = await db.getElections({ ids });
  //   const electionsAuthorizedForDeletion = elections
  //     .filter(({ created_by }) => created_by === claims.userId)
  //     .filter(
  //       ({ id }) => (tokens.isWeakClaims(claims) ? id === claims.electionId : true) //if the claims are weak, there's only one election they can delete
  //     )
  //     .map(({ id }) => id);

  //   if (electionsAuthorizedForDeletion.length == 0) {
  //     return;
  //   }

  //   await db.deleteElections({ ids: electionsAuthorizedForDeletion });
  throw new Error('not yet');
}
