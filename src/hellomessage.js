// in this example, we define a React Component first...
var HelloMessage = React.createClass({
  render: function() {
    return <div>Hello, {this.props.name}.</div>;
  }
});

// ...then we instruct React to render that component, using some props. 
React.render(
  <HelloMessage name="John" />,
  document.getElementById('container')
);

// Note, however, that <HelloMessage> doesn't appear anywhere in the final HTML, 
// even though it looks like an element here in the source.
// See what it compiles to at: `build/hellomessage.js`