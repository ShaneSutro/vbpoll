import React from 'react';
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';
import moment from 'moment';
import PollSetup from './pollSetup';
import Vote from './vote';
import sharedFunctions from '../sharedFunctions';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      modalOpen: false,
      userHasVoted: false,
      userVotedFor: '',
      pollID: '',
      subId: '',
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
        allowUnlimitedVotes: '0',
        isOpen: false,
        question: '',
        a: '',
        b: '',
        c: '',
        openAsOf: '',
        openUntil: '',
        frequency: '2',
      },
    };
    this.inputFieldChange = this.inputFieldChange.bind(this);
    this.savePoll = this.savePoll.bind(this);
    this.getVoteStatus = this.getVoteStatus.bind(this);
    this.saveVote = this.saveVote.bind(this);
  }

  componentDidMount() {
    let { pollID } = this.props.match.params;
    const search = this.props.location.search;
    const subId = new URLSearchParams(search).get('subscription_id');
    this.getCurrentPoll(subId);
    if (!this.state.pollID) { this.regenerateId(); }
    if (pollID !== 'edit') { this.setState({ pollID }); }
    console.log('Set New Poll ID');
    this.getVoteStatus();
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const pollData = { ...this.state.poll }; // TODO: This should come from the database eventually
    pollData.openUntil = `${moment(nextWeek).format('YYYY-MM-DD')}T23:59`;
    this.setState({ poll: pollData });
  }

  async getCurrentPoll(subId) {
    fetch(`/polls/find/${subId}`)
      .then((initial) => {
        if (initial.status === 204) {
          this.setState({ subId });
        }
        return initial;
      })
      .then((response) => response.json())
      .then((poll) => {
        console.log('Sub Id: ', subId);
        this.setState({
          poll: poll.poll,
          previouslySaved: poll.poll,
          pollID: poll.pollID,
          subId,
        });
      })
      .catch((err) => console.error(err));
  }

  async getVoteStatus() {
    const { pollID } = this.state;
    console.log(pollID);
    let ip;
    let userHasVoted;
    let userVotedFor;
    await fetch('https://api.ipify.org?format=json', { mode: 'cors' })
      .then((res) => res.json())
      .then((data) => {
        ip = data.ip;
        this.setState({ user: ip });
      });
    fetch(`/verify/${pollID}/${ip}`)
      .then((res) => res.json())
      .then((data) => {
        userHasVoted = data.voted;
        userVotedFor = data.votedForOption;
        this.setState({ userHasVoted, userVotedFor });
        if (this.state.poll.allowUnlimitedVotes === '0') {
          document.getElementsByClassName(`answer-${userVotedFor}`)[0].classList.add('chosen');
        }
      });
  }

  savePoll() {
    let { poll, pollID, subId } = this.state;
    const newPoll = { ...sharedFunctions.pollTemplate };
    if (!poll.isOpen) {
      newPoll.poll = { ...poll };
      newPoll.pollID = pollID;
      newPoll.subId = subId;
    }
    console.log(poll);
    console.log('Saving poll information');
    fetch('/polls/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pollID, poll: newPoll }),
    })
      .then(() => console.log('saved'))
      .catch((err) => console.error(err));
  }

  regenerateId() {
    const pollID = sharedFunctions.generatePollId();
    this.setState({ pollID });
  }

  saveVote(option) {
    let { pollID, user } = this.state;
    fetch(`/vote/${pollID}/${user}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ option }),
    })
      .then((res) => {
        if (res.status === 201) {
          const allAnswerButtons = document.getElementsByClassName('answer');
          for (let button of allAnswerButtons) {
            button.classList.remove('chosen');
          }
          const votedForButton = document.getElementsByClassName(`answer-${option}`)[0];
          votedForButton.classList.add('chosen');
        }
      })
      .catch((err) => console.error(err));
  }

  inputFieldChange(val, inputName) {
    const newPollState = { ...this.state.poll };
    const previousPollSet = { ...this.state.previouslySaved };
    newPollState[inputName] = val;
    const updating = newPollState[inputName] !== previousPollSet[inputName];
    this.setState({ poll: { ...newPollState }, updating });
  }

  render() {
    const { poll } = this.state;
    return (
      <Router>
        <Switch>
          <Route exact path="/edit">
            <PollSetup actions={{ onChange: this.inputFieldChange, save: this.savePoll }} state={{ ...this.state }} />
          </Route>
          <Route path="/:id">
            <Vote actions={{ saveVote: this.saveVote }} state={{ ...poll }} />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default withRouter(App);
