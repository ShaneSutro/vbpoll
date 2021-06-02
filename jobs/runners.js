const { Vesta } = require('vestaboard-api');
const fetch = require('node-fetch');
const { poll } = require('../data/model');
const moment = require('moment');

const vesta = new Vesta('', '');

const convertLine = (string) => vesta.characterArrayFromString(string).slice(0, 1)[0];

const convertAnswerLine = (option, answer, pct, isWinning) => {
  const rainbowLine = ['redBlock', 'orangeBlock', 'yellowBlock', 'greenBlock', 'blueBlock', 'violetBlock', 'redBlock', 'orangeBlock', 'yellowBlock', 'greenBlock', 'blueBlock', 'violetBlock', 'redBlock', 'orangeBlock', 'yellowBlock', 'greenBlock', 'blueBlock', 'violetBlock'];
  let line = `${option}) ${answer}`;
  const spacer = 22 - (pct.length + 1) - line.length;
  for (let i = 0; i <= spacer; i += 1) {
    if (isWinning) {
      line += ` ${rainbowLine[i]}`;
    } else {
      line += ' ';
    }
  }
  line += ` ${pct}`;
  return convertLine(line);
};

const calculatePercentages = (votes) => {
  const percentages = {};
  if (votes.totalVotes === 0) {
    percentages.a = {
      pct: '0',
      isWinning: false,
    };
    percentages.b = {
      pct: '0',
      isWinning: false,
    };
    percentages.c = {
      pct: '0',
      isWinning: false,
    };
    return percentages;
  }
  percentages.a = {
    pct: Math.floor(Math.round((votes.a / votes.totalVotes) * 100)),
    isWinning: false,
  };
  percentages.b = {
    pct: Math.floor(Math.round((votes.b / votes.totalVotes) * 100)),
    isWinning: false,
  };
  percentages.c = {
    pct: Math.floor(Math.round((votes.c / votes.totalVotes) * 100)),
    isWinning: false,
  };
  if (votes.a > votes.b && votes.a > votes.c) {
    percentages.a.isWinning = true;
  } else if (votes.b > votes.a && votes.b > votes.c) {
    percentages.b.isWinning = true;
  } else if (votes.c > votes.a && votes.c > votes.b) {
    percentages.c.isWinning = true;
  }
  return percentages;
};

const sendMessage = (creds, characters) => {
  console.log(`Sending to ${creds.subId}`);
  fetch(`https://platform.vestaboard.com/subscriptions/${creds.subId}/message`, {
    method: 'POST',
    headers: {
      'X-Vestaboard-Api-Key': creds.apiKey,
      'X-Vestaboard-Api-Secret': creds.apiSecret,
    },
    body: JSON.stringify({ characters }),
  })
    .then((response) => console.log(response.status));
};

module.exports = {
  'c5d472aa-260d-4e7e-84ab-f069a3c83729': async (data) => {
    const pollInfo = await poll.getBySub(data.subId);
    let pollClosed = false;
    if (!pollInfo.poll.isOpen || new Date() > moment(pollInfo.poll.openUntil).toDate()) {
      console.log('Poll is closed or expired');
      pollClosed = true;
    }
    const messageArray = [
      // Title line
      [
        65, 65, 65, 65, 65, 65, 65, 0, 0, 16, 15, 12, 12, 0, 0, 65, 65, 65, 65, 65, 65, 65,
      ],
    ];
    messageArray.push(convertLine(`  vbpoll.app/${pollInfo.pollID}  `));
    if (pollInfo.voteCounts.totalVotes === 1 && !pollClosed) {
      messageArray.push(convertLine('        1 vote        '));
    } else if (pollClosed) {
      console.log('Poll is closed');
      messageArray.push(convertLine(`  closed - ${pollInfo.voteCounts.totalVotes} vote${pollInfo.voteCounts.totalVotes > 1 ? 's' : ''}  `));
    } else {
      messageArray.push(convertLine(`       ${pollInfo.voteCounts.totalVotes} votes       `));
    }
    const percentages = calculatePercentages(pollInfo.voteCounts);
    messageArray.push(convertAnswerLine('A', pollInfo.poll.a, `${percentages.a.pct}%`, percentages.a.isWinning));
    messageArray.push(convertAnswerLine('B', pollInfo.poll.b, `${percentages.b.pct}%`, percentages.b.isWinning));
    if (pollInfo.poll.c !== '') {
      messageArray.push(convertAnswerLine('C', pollInfo.poll.c, `${percentages.c.pct}%`, percentages.c.isWinning));
    } else {
      messageArray.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
    sendMessage({
      subId: data.subId,
      apiKey: data.apiKey,
      apiSecret: data.apiSecret,
    }, messageArray);
  },
};
