import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import * as VB from '@vestaboard/installables';
import dayjs from 'dayjs';
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
        allowUnlimitedVotes: '0',
        isOpen: true,
        question: '',
        a: '',
        b: '',
        c: '',
        openUntil: '',
        frequency: '',
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
      errors: {
        question: '',
        a: '',
        b: '',
        c: '',
        frequency: '',
      },
      toast: {
        message: '',
        severity: '',
        open: false,
      },
    };
    this.inputFieldChange = this.inputFieldChange.bind(this);
    this.savePoll = this.savePoll.bind(this);
    this.getVoteStatus = this.getVoteStatus.bind(this);
    this.saveVote = this.saveVote.bind(this);
    this.resetVotes = this.resetVotes.bind(this);
    this.closeToast = this.closeToast.bind(this);
    this.showToast = this.showToast.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.deletePoll = this.deletePoll.bind(this);
  }

  componentDidMount() {
    const { pollID } = this.props.match.params;
    const { search } = this.props.location;
    const subId = new URLSearchParams(search).get('subscription_id');
    const configToken = new URLSearchParams(search).get('subscription_configuration_token');
    this.setState({ subId, configToken });
    this.getCurrentPoll(subId, pollID);
    if (!this.state.pollID && pollID === 'edit') {
      this.regenerateId();
    }
    this.getVoteStatus(pollID);
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const pollData = { ...this.state.poll };
    pollData.openUntil = `${dayjs(nextWeek).format('YYYY-MM-DD')}T23:59`;
    this.setState({ poll: pollData });
  }

  async getCurrentPoll(subId, pollID) {
    let url;
    if (!subId) {
      url = `/polls/find/poll/${pollID}`;
    } else {
      url = `/polls/find/${subId}`;
    }
    fetch(url)
      .then((initial) => {
        if (initial.status !== 204) {
          this.setState({ subId });
        }
        return initial;
      })
      .then((response) => {
        if (response.status === 204) {
          return null;
        }
        return response.json();
      })
      .then((poll) => {
        if (poll) {
          this.setState({
            newPoll: false,
            poll: poll.poll,
            previouslySaved: poll.poll,
            pollID: poll.pollID,
            subId,
          });
        }
      })
      .catch((err) => console.error(err));
  }

  async getVoteStatus(pollID) {
    let userHasVoted;
    let userVotedFor;
    fetch(`/vote/verify/${pollID}`)
      .then((res) => res.json())
      .then((data) => {
        userHasVoted = data.voted;
        userVotedFor = data.votedForOption;
        this.setState({ userHasVoted, userVotedFor });
      });
  }

  savePoll() {
    const { poll, pollID, subId } = this.state;
    let didError = false;
    ['question', 'a', 'b', 'frequency'].forEach((name) => {
      if (poll[name] === '') {
        didError = true;
        const { errors } = this.state;
        errors[name] = 'This field is required.';
        this.setState({ errors });
      } else {
        const { errors } = this.state;
        errors[name] = '';
        this.setState({ errors });
      }
    });
    if (didError) {
      return;
    }
    let metadata;
    if (poll.isOpen) {
      metadata = {};
    } else if (!poll.isOpen) {
      metadata = { ...sharedFunctions.pollTemplate };
      poll.isOpen = true;
      metadata.pollID = pollID;
      metadata.subId = subId;
      // this.updatePollFrequency();
    }
    fetch('/polls/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pollID, metadata, pollData: poll }),
    })
      .then(() => console.log('saved'))
      .then(() => {
        if (poll.frequency !== this.state.previouslySaved.frequency) {
          this.updatePollFrequency();
        }
      })
      .then(() => {
        this.showToast('Saved!', 'success');
        this.componentDidMount();
      })
      .catch((err) => {
        console.error(err);
        this.showToas('Something went wrong!', 'error');
      });
  }

  updatePollFrequency() {
    const { subId, poll } = this.state;
    fetch('/polls/frequency/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subId, newFrequency: poll.frequency }),
    }).then(() => console.log('Updated frequency'));
  }

  regenerateId() {
    const pollID = sharedFunctions.generatePollId();
    this.setState({ pollID });
  }

  saveVote(option) {
    const { pollID } = this.state;
    fetch(`/vote/${pollID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ option }),
    })
      .then((res) => {
        if (res.status === 201) {
          this.setState({ userVotedFor: option });
          // const allAnswerButtons = document.getElementsByClassName('answer');
          // for (const button of allAnswerButtons) {
          //   button.classList.remove('chosen');
          // }
          // const votedForButton = document.getElementsByClassName(
          //   `answer-${option}`,
          // )[0];
          // votedForButton.classList.add('chosen');
          this.showToast('Vote saved!', 'successs');
        }
      })
      .catch((err) => {
        this.showToast('Whoops, something went wrong.', 'error');
      });
  }

  inputFieldChange(val, inputName) {
    ['a', 'b', 'c'].forEach((name) => {
      if (inputName === name && val.length > 14) {
        const { errors } = this.state;
        errors[name] = 'Too many characters for this line!';
        this.setState({ errors });
      } else if (val.length <= 14) {
        const { errors } = this.state;
        errors[name] = '';
        this.setState({ errors });
      }
    });
    const newPollState = { ...this.state.poll };
    const previousPollSet = { ...this.state.previouslySaved };
    newPollState[inputName] = val;
    const updating = newPollState[inputName] !== previousPollSet[inputName];
    this.setState({ poll: { ...newPollState }, updating });
  }

  resetVotes() {
    const { pollID } = this.state;
    fetch('/vote/reset/all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pollID }),
    })
      .then(() => {
        this.showToast('Votes reset!', 'success');
      })
      .catch(() => {
        this.showToast('Error resetting votes!', 'error');
      });
  }

  deletePoll() {
    const { pollID, subId } = this.state;
    fetch('/polls/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pollID, subId }),
    })
      .then((response) => console.log('response:', response))
      .then(() => this.showToast('Poll deleted', 'success'))
      .then(() => this.componentDidMount())
      .catch(() => this.showToast('Error deleting poll', 'error'));
  }

  updateStatus() {
    const { poll, pollID } = this.state;
    fetch('/polls/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pollID, status: !poll.isOpen }),
    })
      .then(() => {
        this.showToast(
          `Poll is now ${!poll.isOpen ? 'open' : 'closed'}`,
          'success',
        );
        this.componentDidMount();
      })
      .catch(() => this.showToast('Error saving poll status!', 'error'));
  }

  showToast(message, severity) {
    this.setState({ toast: { message, severity, visible: true } });
  }

  closeToast() {
    const { toast } = this.state;
    toast.visible = false;
    this.setState({ toast });
  }

  render() {
    const { poll, toast, userVotedFor } = this.state;
    return (
      <Router>
        <Switch>
          <Route exact path="/edit">
            <VB.Toast
              severity={toast.severity}
              message={toast.message}
              open={toast.visible}
              onClose={this.closeToast}
            />
            <PollSetup
              actions={{
                updateStatus: this.updateStatus,
                resetVotes: this.resetVotes,
                onChange: this.inputFieldChange,
                save: this.savePoll,
                deletePoll: this.deletePoll,
              }}
              state={{ ...this.state }}
            />
          </Route>
          <Route path="/:id">
            <VB.Toast
              severity={toast.severity}
              message={toast.message}
              open={toast.visible}
              onClose={this.closeToast}
            />
            <Vote
              actions={{ showToast: this.showToast, saveVote: this.saveVote }}
              poll={poll}
              chosen={userVotedFor}
            />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default withRouter(App);
