import React from 'react';
import * as VB from '@vestaboard/installables';
import moment from 'moment';

const frequencyOptions = [
  { id: '1', name: 'Every minute' },
  { id: '2', name: 'Every 5 minutes' },
  { id: '3', name: 'Every 10 minutes' },
  { id: '4', name: 'Every 15 minutes' },
  { id: '5', name: 'Every 20 minutes' },
  { id: '6', name: 'Every 30 minutes' },
  { id: '7', name: 'Every 60 minutes' },
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pollID: '3a83np',
      updating: false,
      newPoll: true,
      previouslySaved: {
        allowUnlimitedVotes: '1',
        isOpen: true,
        question: '',
        a: '',
        b: '',
        c: '',
        openUntil: '2021-05-27T12:45',
        frequency: '1',
      },
      poll: {
        allowUnlimitedVotes: '1',
        isOpen: true,
        question: '',
        a: '',
        b: '',
        c: '',
        openUntil: '2021-05-27T12:45',
        frequency: '1',
      },
    };
    this.inputFieldChange = this.inputFieldChange.bind(this);
  }

  componentDidMount() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 7);
    const pollData = {...this.state.poll}; // TODO: This should come from the database eventually
    pollData.openUntil = `${moment(tomorrow).format('YYYY-MM-DD')}T23:59`;
    pollData.isOpen = false;
    this.setState({ poll: pollData });
  }

  inputFieldChange(val, inputName) {
    const newPollState = { ...this.state.poll };
    const previousPollSet = { ...this.state.previouslySaved };
    newPollState[inputName] = val;
    const updating = newPollState[inputName] !== previousPollSet[inputName];
    this.setState({ poll: { ...newPollState }, updating });
  }

  render() {
    const { poll, updating, newPoll, pollID } = this.state;
    return (
      <div className="main">
        <VB.Title>VB Polls</VB.Title>
        <VB.SubTitle2>Set up a poll below!</VB.SubTitle2>
        <VB.Body>Vote at https://vbpoll.app/{pollID}</VB.Body>
        <VB.Medium>Note: To save space, the question is only visible on the voting page</VB.Medium>
        {poll.isOpen
          ? <div className="poll-open"><VB.Body><VB.Icon color="white" type="check" /> This poll is open!</VB.Body></div>
          : <div className="poll-closed"><VB.Body><VB.Icon color="white" type="close" /> No Active Poll</VB.Body></div>}
        <div className="poll-setup">
          <VB.Input label="Poll Question" multiline onValueChange={(val) => this.inputFieldChange(val, 'question')} value={poll.question} />
          <VB.Input label="Option 1" error="" onValueChange={(val) => this.inputFieldChange(val, 'a')} value={poll.a} />
          <VB.Input label="Option 2" error="" onValueChange={(val) => this.inputFieldChange(val, 'b')} value={poll.b} />
          <VB.Input label="Option 3" error="" onValueChange={(val) => this.inputFieldChange(val, 'c')} value={poll.c} />
          <VB.Input label="Poll Open Until" type="datetime-local" onValueChange={(val) => this.inputFieldChange(val, 'openUntil')} value={poll.openUntil} />
          <VB.Select onValueChange={(val) => this.inputFieldChange(val, 'frequency')} value={poll.frequency} label="Update Vestaboard How Often?" options={frequencyOptions} />
        </div>
        <div className="actions">
          <VB.RadioButtons options={[{ id: '0', name: 'Allow 1 Vote Per IP Address' }, { id: '1', name: 'Allow Unlimited Votes (Default)' }]} onValueChange={(val) => this.inputFieldChange(val, 'allowUnlimitedVotes')} value={poll.allowUnlimitedVotes} />
          <VB.Button buttonType="primary">{updating && !newPoll ? 'Update' : 'Save'}</VB.Button>
          {poll.isOpen
            ? <VB.Button buttonType="danger" endIcon={<VB.Icon color="white" type="close" />}>Close Poll</VB.Button>
            : newPoll
            ? null
            : <VB.Button buttonType="outline" endIcon={<VB.Icon color="white" type="check" />}>Open Poll</VB.Button>}
          <VB.Medium>Problems? Send me an email or find me on Twitter at @shanesutro</VB.Medium>
        </div>
      </div>
    );
  }
}

export default App;
