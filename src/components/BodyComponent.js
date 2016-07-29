require('styles/Body.sass');
import React from 'react';
import { DB } from '../sources/fire';
import Hilitor from '../scripts/hilighter'

let results;

const myHilitor = new Hilitor('content');

class BodyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.firebaseRef = DB;
    this.makeDummyElements = this.makeDummyElements.bind(this);
  }
  makeDummyElements() {
    let sentences = ['Donald Trump wants to make America Great Again',
                    'Hillary Clinton does not believe in Trump`s abilities or experience',
                    'I like turtles.'];
    let elements = sentences.map( (el, idx) => {
        return <li key={idx}> { el } </li>
    });
    return ( <ul id='content' className='dummy'> {elements} </ul> );
  }
  componentWillMount() {
    this.firebaseRef.once('value', (snapshot) => {
        const count = snapshot.numChildren();
        const val = snapshot.val();
        console.log(`Found ${count} children: ${JSON.stringify(val)}`);
        results = val;
        myHilitor.apply(results); //('turtles believe');
    });

  }
  componentDidMount() {
    console.log('[BC] Loaded');
    // document.addEventListener("DOMContentLoaded", function() {
  }
  componentWillUnmount() {
    //
  }
  render() {
    const dummyElements = this.makeDummyElements();
    return (
      <div className='body-component'>
        { dummyElements }
        <p> This is some raw text
            <b className='tooltip'> but look a tooltip!
                <span className='tooltiptext'>Tooltip text</span>
            </b>
        </p>
      </div>
    );
  }
}

BodyComponent.displayName = 'BodyComponent';

// Uncomment properties you need
// BodyComponent.propTypes = {};
// BodyComponent.defaultProps = {};

export default BodyComponent;
