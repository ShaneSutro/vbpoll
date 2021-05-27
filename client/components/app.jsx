import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test: 'Test for changing state',
    };
  }

  render() {
    const { test } = this.state;
    return (
      <div>
        <h1>Hello from React!</h1>
        <h3>{test}</h3>
      </div>
    );
  }
}

export default App;
