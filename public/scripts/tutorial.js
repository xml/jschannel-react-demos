/* 
For our comment box example, we'll have the following component structure:

- CommentBox
  - CommentList
    - Comment
  - CommentForm

*/

var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        {/* here's where we invoke the new components we're defining below: */}
        {/* (Note this special syntax for child comments.) */}
        <CommentList />
        <CommentForm />
      </div>
    );
  }
});

// Now, let's create some additional components that we're going to
// nest inside the main element: "composition"
var CommentList = React.createClass({
  render: function() {
    return (
      <div className="commentList">
        Hello, world! I am a CommentList.
      </div>
    );
  }
});

var CommentForm = React.createClass({
  render: function() {
    return (
      <div className="commentForm">
        Hello, world! I am a CommentForm.
      </div>
    );
  }
});


React.render(
  <CommentBox />,
  document.getElementById('content')
);
