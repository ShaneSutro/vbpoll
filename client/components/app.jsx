import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import * as VB from '@vestaboard/installables';
import moment from 'moment';
import PollSetup from './pollSetup';
import Vote from './vote';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'vote',
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
        question: 'Where should we go for lunch today?',
        a: 'Modern Market',
        b: 'Chipotle',
        c: 'Sushi Den',
        openUntil: '2021-05-27T12:45',
        frequency: '1',
      },
    };
    this.inputFieldChange = this.inputFieldChange.bind(this);
    this.savePoll = this.savePoll.bind(this);
  }

  componentDidMount() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 7);
    const pollData = { ...this.state.poll }; // TODO: This should come from the database eventually
    pollData.openUntil = `${moment(tomorrow).format('YYYY-MM-DD')}T23:59`;
    pollData.isOpen = false;
    this.setState({ poll: pollData });
  }

  checkMode() {
    // TODO: Check route and implement different views here
  }

  savePoll() {
    console.log('Saving poll information');
    console.log(this.state.poll);
  }

  inputFieldChange(val, inputName) {
    const newPollState = { ...this.state.poll };
    const previousPollSet = { ...this.state.previouslySaved };
    newPollState[inputName] = val;
    const updating = newPollState[inputName] !== previousPollSet[inputName];
    this.setState({ poll: { ...newPollState }, updating });
  }

  render() {
    const { mode, poll } = this.state;
    return (
      <Router>
        <Switch>
          <Route exact path="/config">
            <PollSetup actions={{ onChange: this.inputFieldChange, save: this.savePoll }} state={{ ...this.state }} />
          </Route>
          <Route path="/:id">
            <Vote state={{ ...poll }} />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
