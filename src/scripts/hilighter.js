// Original JavaScript code by Chirp Internet: www.chirp.com.au
// Please acknowledge use of this code by including this header.

export default function Hilitor(id, tag)
{

  var targetNode = document.getElementById(id) || document.body;
  var hiliteTag = tag || 'EM';
  var skipTags = new RegExp('^(?:' + hiliteTag + '|SCRIPT|FORM|SPAN)$');
  var colors = ['#ff6', '#a0ffff', '#9f9', '#f99', '#f6f'];
  var wordColor = [];
  var colorIdx = 0;
  var matchRegex = '';
  var replacementWords = {};
  var hoverWords = {};

  this.setMatchType = function(type)
  {
    switch(type)
    {
      case 'left':
        this.openLeft = false;
        this.openRight = true;
        break;
      case 'right':
        this.openLeft = true;
        this.openRight = false;
        break;
      case 'open':
        this.openLeft = this.openRight = true;
        break;
      default:
        this.openLeft = this.openRight = false;
    }
  };

  this.setReplacementWords = function(mapping) {
    Object.keys(mapping).forEach( (key, idx) => {
      let replacement;
      var hover = null;
      try {
        replacement = mapping[key].swap ? mapping[key].swap : key;
        hover = mapping[key].message ? mapping[key].message : null;
      }
      catch(err) {
        console.error(`[HI] ERROR: ${err}`);
        replacement = key;
      }
      finally {
        replacementWords[key] = replacement;
        hoverWords[key] = hover;
      }
    });
  }

  this.setRegex = function(input)
  {
    input = input.replace(/^[^\w]+|[^\w]+$/g, '').replace(/[^\w'-]+/g, '|');
    input = input.replace(/^\||\|$/g, '');
    if(input) {
      var re = '(' + input + ')';
      if(!this.openLeft) re = '\\b' + re;
      if(!this.openRight) re = re + '\\b';
      matchRegex = new RegExp(re, 'i');
      return true;
    }
    return false;
  };

  this.getRegex = function()
  {
    var retval = matchRegex.toString();
    retval = retval.replace(/(^\/(\\b)?|\(|\)|(\\b)?\/i$)/g, '');
    retval = retval.replace(/\|/g, ' ');
    return retval;
  };

  // recursively apply word highlighting
  this.hiliteWords = function(node)
  {
    if(node === undefined || !node) return;
    if(!matchRegex) return;
    if(skipTags.test(node.nodeName)) return;

    if(node.hasChildNodes()) {
      for(var i=0; i < node.childNodes.length; i++)
        this.hiliteWords(node.childNodes[i]);
    }
    if(node.nodeType == 3) { // NODE_TEXT
      let nv;
      let regs;
      if((nv = node.nodeValue) && (regs = matchRegex.exec(nv))) {
        if(!wordColor[regs[0].toLowerCase()]) {
          wordColor[regs[0].toLowerCase()] = colors[colorIdx++ % colors.length];
        }

        var match = document.createElement(hiliteTag);
        // console.log(regs[0], replacementWords);
        var replacementText = replacementWords[ regs[0].toLowerCase() ]
        replacementText = replacementText ? replacementText : regs[0];

        const childTextNode = document.createTextNode( replacementText );
        match.appendChild(childTextNode);

        const hover = hoverWords[ regs[0].toLowerCase() ]
        if (hover) {
          const tooltiptext =  document.createTextNode(hover);
          const tooltipspan = document.createElement('span');
          match.classList = 'tooltip';
          tooltipspan.classList = 'tooltiptext';
          tooltipspan.appendChild(tooltiptext);
          match.appendChild(tooltipspan);
        }

        match.style.backgroundColor = wordColor[regs[0].toLowerCase()];
        match.style.fontStyle = 'inherit';
        match.style.color = '#000';

        var after = node.splitText(regs.index);
        after.nodeValue = after.nodeValue.substring(regs[0].length);
        node.parentNode.insertBefore(match, after);
      }
    }
  };

  // remove highlighting
  this.remove = function()
  {
    var arr = document.getElementsByTagName(hiliteTag);
    let el;
    while(arr.length && ( el = arr[0])) {
      var parent = el.parentNode;
      parent.replaceChild(el.firstChild, el);
      parent.normalize();
    }
  };

  // start highlighting at target node
  this.apply = function(input)
  {
    this.remove();
    if(input === undefined || !input) return;
    let inputString = input
    if(typeof(input) != 'string') {
      try {
        this.setReplacementWords(input);
        inputString = Object.keys(input).join(' ');
      }
      catch(err) {
        console.warn(`[HI] Error: ${err}`);
      }
    }
    if(this.setRegex(inputString)) {
      this.hiliteWords(targetNode);
    }
  };

}