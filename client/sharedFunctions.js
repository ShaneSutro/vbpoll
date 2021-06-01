import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 7);

export default {
  generatePollId: () => {
    const id = nanoid();
    console.log(id);
    return id;
  },
  pollTemplate: {
    pollID: '',
    subId: '',
    voteCounts: {
      totalVotes: 0,
      a: 0,
      b: 0,
      c: 0,
    },
    votes: [
    ],
  },
};
