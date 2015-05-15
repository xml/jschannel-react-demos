/* 
For our comment box example, we'll have the following component structure:

- CommentBox
  - CommentList
    - Comment
  - CommentForm

*/

// First, define the basic version of the main 'CommentBox' element:
var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        Hello, world! I am a CommentBox.
      </div>
    );
  }
});

// Now tell React to create and render it. We're saying here:
// 1. Call the render function of the Component called 'CommentBox'
// 2. Place the rendered component inside the #content element
React.render(
  <CommentBox />,
  document.getElementById('content')
);

/* Note that the JSXTransformer will translate the above to:

    var CommentBox = React.createClass({displayName: 'CommentBox',
      render: function() {
        return (
          React.createElement('div', {className: "commentBox"},
            "Hello, world! I am a CommentBox."
          )
        );
      }
    });
    React.render(
      React.createElement(CommentBox, null),
      document.getElementById('content')
    );


Read more about JSX at: 
https://facebook.github.io/react/docs/jsx-in-depth.html
*/