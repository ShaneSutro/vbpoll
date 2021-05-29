import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 6);

export default {
  generatePollId: () => {
    const id = nanoid();
    console.log(id);
    return id;
  },
};
