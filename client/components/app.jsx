import React from 'react';
import * as VB from '@vestaboard/installables';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test: 'Test for changing state',
    };
  }

  render() {
    return (
      <div className="main">
        <VB.Title>VB Polls</VB.Title>
        <VB.SubTitle2>Set up a poll below!</VB.SubTitle2>
        <VB.Body>Vote at: https://vbpoll.app/3a93np</VB.Body>
        <VB.Input label="Poll Question" multiline />
        <VB.Input label="Option 1" error="" />
        <VB.Input label="Option 2" />
        <VB.Input label="Option 3" />
        <VB.Input label="Poll Open Until:" type="date" value={'2021-01-01'} />
        <VB.RadioButtons options={[{ id: '1', name: 'Allow Unlimited Votes' }, { id: '2', name: 'Allow 1 Vote Per IP Address' }]} value={'1'} />
        <VB.Medium>Problems? Send me an email or find me on Twitter at @shanesutro</VB.Medium>
      </div>
    );
  }
}

export default App;
