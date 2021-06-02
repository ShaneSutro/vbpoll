/* eslint-disable no-nested-ternary */
import React from 'react';
import * as VB from '@vestaboard/installables';

const frequencyOptions = [
  { id: '1', name: 'Every minute' },
  { id: '2', name: 'Every 5 minutes' },
  { id: '3', name: 'Every 10 minutes' },
  { id: '4', name: 'Every 15 minutes' },
  { id: '5', name: 'Every 20 minutes' },
  { id: '6', name: 'Every 30 minutes' },
  { id: '7', name: 'Every 60 minutes' },
];

const PollSetup = (props) => {
  const {
    poll, updating, newPoll, pollID, errors,
  } = props.state;
  const {
    onChange, save, resetVotes, updateStatus, deletePoll,
  } = props.actions;
  return (
    <div className="main">
      <VB.Title>VB Polls</VB.Title>
      <VB.SubTitle2>
        Set up a poll below and vote at
        {' '}
        <i>
          https://vbpoll.app/
          {pollID}
        </i>
      </VB.SubTitle2>
      <VB.Medium>
        Note: To save space, the question is only visible on the voting page.
        Use caution when editing - votes carry across edits, so only edit for
        typos. If you need to start over, use the reset button below.
      </VB.Medium>
      {poll.isOpen ? (
        <div className="poll-open">
          <VB.Body>
            <VB.Icon color="white" type="check" />
            {' '}
            This poll is open!
          </VB.Body>
        </div>
      ) : (
        <div className="poll-closed">
          <VB.Body>
            <VB.Icon color="white" type="close" />
            {' '}
            No Active Poll
          </VB.Body>
        </div>
      )}
      <div className="poll-setup">
        <VB.Input
          label="Poll Question"
          error={errors.question}
          multiline
          onValueChange={(val) => onChange(val, 'question')}
          value={poll.question}
        />
        <VB.Input
          label="Option 1"
          error={errors.a}
          onValueChange={(val) => onChange(val, 'a')}
          value={poll.a}
        />
        <VB.Input
          label="Option 2"
          error={errors.b}
          onValueChange={(val) => onChange(val, 'b')}
          value={poll.b}
        />
        <VB.Input
          label="Option 3"
          error={errors.c}
          onValueChange={(val) => onChange(val, 'c')}
          value={poll.c}
        />
        <VB.Input
          label="Poll Open Until"
          type="datetime-local"
          onValueChange={(val) => onChange(val, 'openUntil')}
          value={poll.openUntil}
        />
        <VB.Select
          onValueChange={(val) => onChange(val, 'frequency')}
          value={poll.frequency}
          label="Update Vestaboard How Often?"
          options={frequencyOptions}
        />
      </div>
      <div className="actions">
        {/* <VB.RadioButtons
          options={[
            { id: '0', name: 'Allow 1 Vote Per IP Address' },
            { id: '1', name: 'Allow Unlimited Votes' },
          ]}
          onValueChange={(val) => onChange(val, 'allowUnlimitedVotes')}
          value={poll.allowUnlimitedVotes}
        /> */}
        <VB.Button onClick={save} buttonType="primary">
          {updating && !newPoll ? 'Update' : 'Save'}
        </VB.Button>
        {poll.isOpen ? (
          <VB.Button
            onClick={updateStatus}
            buttonType="outline"
            endIcon={<VB.Icon color="white" type="close" />}
          >
            Close Poll
          </VB.Button>
        ) : newPoll ? null : (
          <VB.Button
            onClick={updateStatus}
            buttonType="outline"
            endIcon={<VB.Icon color="white" type="check" />}
          >
            Open Poll
          </VB.Button>
        )}
        <div className="danger-area">
          <VB.SubTitle2>These actions cannot be undone! Please use caution.</VB.SubTitle2>
          <VB.Button onClick={resetVotes} buttonType="danger">
            Reset Vote Counts
          </VB.Button>
          {poll.isOpen ? null
            : (
              <VB.Button onClick={deletePoll} buttonType="danger">
                Delete Poll
              </VB.Button>
            )}
        </div>
        <VB.Medium>
          Problems? Send me an email or find me on Twitter at @shanesutro
        </VB.Medium>
      </div>
    </div>
  );
};

export default PollSetup;
