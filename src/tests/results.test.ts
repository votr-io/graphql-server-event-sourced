import { makePublicElection } from './createElection.test';

test(`results`, async () => {
  const { election, service } = await makePublicElection();
  const electionId = election.id;
  const candidateIds = election.candidates.map(({ id }) => id);

  await service.StartElection({ electionId });
  for (let i = 0; i < 10; i++) {
    await service.CastBallot({ electionId, candidateIds });
  }
  await service.StopElection({ electionId });
  const electionWithResults = await service.GetElections({ ids: [electionId] });
  console.log(electionWithResults.data.getElections.elections[0]);
  expect(electionWithResults.data.getElections.elections[0].results.winner.id).toBe(
    candidateIds[0]
  );
});
