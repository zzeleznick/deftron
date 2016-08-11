require('styles/Presence.sass');
import React from 'react';
import { DB } from '../sources/fire';

let results;
let onlineRef = DB.ref('/.info/connected');
let onlineCountRef = DB.ref('/active');

const onDisconnect = (ref) => {
  ref.onDisconnect().remove()
      .then(function() {
        console.log("Remove successfully bound.")
      })
      .catch(function(error) {
        console.log("Remove binding failed: " + error.message)
      });
}

const registerOnlineUser = () => {
  let timestamp = new Date().getTime();
  let myCountRef = onlineCountRef.child(timestamp);
  myCountRef.set({ first: 'Ada', last: 'Lovelace' })
    .then(() => {
      console.log('Synchronization succeeded');
      onDisconnect(myCountRef);
    })
    .catch(function(error) {
      console.log('Synchronization failed', error);
    });
}

class PresenceComponent extends React.Component {
  constructor(props) {
    super(props);
    // this.firebaseRef = DB.ref('/users');
    this.state = {'count': null}
    this.firebaseCall = this.firebaseCall.bind(this);
  }
  firebaseCall(snapshot) {
    const count = snapshot.numChildren();
    const val = snapshot.val();
    if (!val) {
        console.log('[PC] found no value for snapshot');
    }
    else {
        console.log(`Found ${count} children: ${JSON.stringify(val)}`);
        this.setState({count: count})
    }
    results = val;
  }
  componentWillMount() {
    const caller = this.firebaseCall;
    onlineRef.on('value', (snapshot) => {
      if (snapshot.val()) {
            registerOnlineUser();
      }
      else {
        console.log('[PC] no value for onlineRef');
      }
    });
    onlineCountRef.on('value', caller);
  }
  render() {
    const { count } = this.state;
    return (
      <div className="presence-component">
        <em>Online Users: </em>
        { count ? <span> { count } </span> : null }
      </div>
    );
  }
}

PresenceComponent.displayName = 'PresenceComponent';

// Uncomment properties you need
// PresenceComponent.propTypes = {};
// PresenceComponent.defaultProps = {};

export default PresenceComponent;
