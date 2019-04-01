import { service as baseService, createServiceWithAccessToken } from './service';
import { CreateElectionVariables } from './generated/CreateElection';

export async function makePublicElection(
  input: {
    name?: string;
    description?: string;
    email?: string;
    candidates?: {
      name: string;
      description?: string;
    }[];
  } = {}
) {
  const name = input.name || 'create election test';
  const description = input.description || 'this sure is an election';
  const candidates = input.candidates || [
    {
      name: 'Tiger',
    },
    {
      name: 'Gorilla',
    },
    {
      name: 'Turtle',
    },
    {
      name: 'Leopard',
    },
    {
      name: 'Owl',
    },
  ];
  const email = input.email || 'test@fake.com';

  //create the election and run our tests
  const res = await baseService.CreateElection({
    name,
    description,
    candidates,
    email,
  });
  const { election, adminToken } = res.data.createElection;

  //info we sent in
  expect(election.name).toBe(name);
  expect(election.description).toBe(description);
  candidates.forEach(({ name }) =>
    expect(election.candidates.map(candidate => candidate.name)).toContain(name)
  );

  //stuff that the server automatically creates
  expect(election.status).toBe('PENDING');
  expect(election.statusTransitions[0].status).toBe('PENDING');
  expect(election.results).toBeNull();

  //perform a weak login with the adminToken we just got back
  const {
    data: {
      weakLogin: { accessToken },
    },
  } = await baseService.WeakLogin({ adminToken: adminToken });
  const service = createServiceWithAccessToken(accessToken);
  return {
    election,
    service,
  };
}

test('create election', async () => {
  await makePublicElection();
});

interface ValidationTest {
  input: CreateElectionVariables;
  expectedError: string;
}

const validationTestCases: ValidationTest[] = [
  {
    input: {
      name: '',
      description: '',
      email: 'test@fake.com',
      candidates: [{ name: 'Gorilla' }, { name: 'Tiger' }],
    },
    expectedError: 'name is required',
  },
  {
    input: {
      name: 'this sure is an election',
      description: '',
      email: '',
      candidates: [{ name: 'Gorilla' }, { name: 'Tiger' }],
    },
    expectedError: 'email is required',
  },
  {
    input: {
      name: 'this sure is an election',
      description: 'jkl',
      email: 'test@fake.com',
      candidates: [{ name: '' }, { name: 'Tiger' }],
    },
    expectedError: 'candidate.name is required',
  },
  {
    input: {
      name: 'this sure is an election',
      description: 'jkl',
      email: 'test@fake.com',
      candidates: [{ name: 'Tiger' }],
    },
    expectedError: 'at least two candidates',
  },
  {
    input: {
      name: 'this sure is an election',
      description: 'jkl',
      email: 'test@fake.com',
      candidates: [{ name: 'Tiger' }, { name: 'Tiger' }],
    },
    expectedError: 'duplicate',
  },
  {
    input: {
      name: 'this sure is an election',
      description: 'jkl',
      email: 'test@fake.com',
      candidates: [{ name: 'Tiger' }, { name: 'tIger' }],
    },
    expectedError: 'duplicate',
  },
  {
    input: {
      name: 'this sure is an election',
      description: 'jkl',
      email: 'test@fake.com',
      candidates: [{ id: '1', name: 'Tiger' }, { id: '1', name: 'Gorilla' }],
    },
    expectedError: 'duplicate',
  },
];

test('validation', async () => {
  validationTestCases.forEach(async ({ input, expectedError }) => {
    await expect(baseService.CreateElection(input)).rejects.toThrowError(expectedError);
  });
});

test('provide candidate ids', async () => {
  const res = await baseService.CreateElection({
    name: 'provide candidate ids test',
    description: '',
    email: 'test@fake.com',
    candidates: [{ id: '1', name: 'one' }, { id: '2', name: 'two' }],
  });
  const { candidates } = res.data.createElection.election;
  expect(candidates.find(({ id }) => id === '1').name).toBe('one');
  expect(candidates.find(({ id }) => id === '2').name).toBe('two');
});
