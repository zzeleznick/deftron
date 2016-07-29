require('styles/Body.sass');
import React from 'react';
import DB from '../sources/fire';

class BodyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.firebaseRef = firebase.database().ref('/words');
  }
  componentWillMount() {
    this.firebaseRef.once('value', (snapshot) => {
        const count = snapshot.numChildren();
        const val = snapshot.val();
        console.log(`Found ${count} children: ${JSON.stringify(val)}`);
    })
  }
  componentWillUnmount() {
    //
  }
  render() {
    return (
      <div className="body-component">
        Please edit src/components///BodyComponent.js to update this component!
      </div>
    );
  }
}

BodyComponent.displayName = 'BodyComponent';

// Uncomment properties you need
// BodyComponent.propTypes = {};
// BodyComponent.defaultProps = {};

export default BodyComponent;
