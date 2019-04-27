import { Election } from './../Election/types';
import { setApiKey, send } from '@sendgrid/mail';
import * as tokens from '../User/tokens';

setApiKey(process.env.SENDGRID_API_KEY);

const HOST = 'https://votr.com';
const FROM = 'noreply@votr.com';

export function sendNewElectionEmail(to: string, election: Election) {
  //don't send email if this is an automated test
  if (to.endsWith('@fake.com')) return;

  const adminToken = tokens.encryptAdminToken({
    electionId: election.id,
    userId: election.createdBy,
  });
  const link = `${HOST}/election/${election.id}?adminToken=${adminToken}`;
  const msg = {
    to,
    from: FROM,
    subject: `Election Created: ${election.name}`,
    html: `
        <h1>Thanks for creating the election ${election.name}!</h1>
        <p>You can access the election admin page with this link: <a href="${link}">${link}</a></p>
        <p>${link}</p>
        `,
  };
  send(msg);
}
