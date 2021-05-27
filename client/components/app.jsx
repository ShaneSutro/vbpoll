import React from 'react';
import * as VB from '@vestaboard/installables';
import moment from 'moment';
import PollSetup from './pollSetup';

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
    return (
      <div className="top">
        <PollSetup state={{ ...this.state }} />
      </div>
    );
  }
}

export default App;
