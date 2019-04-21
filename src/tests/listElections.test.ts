import { makePublicElection } from './createElection.test';

test(`listElections`, async () => {
  const { election, service } = await makePublicElection();
  const { id } = election;

  const res = await service.ListElections();
  const elections = res.data.listElections.elections;

  expect(elections.filter(election => election.id === id).length).toBe(1);
});
