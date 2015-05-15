/* 
For our comment box example, we'll have the following component structure:

- CommentBox
  - CommentList
    - Comment
  - CommentForm

*/

// At last, some actual comments for our CommentList in our CommentBox.
// Comments will depend on data passed in from the parent CommentList. 
// Data passed in from a parent component is available as a 'property' 
// on the child component. These 'properties' are accessed through 
// this.props. Using props, we will be able to read the data passed to 
// the Comment from the CommentList. 
var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {/* This interpolation of `author` will be basic text: */}
          {this.props.author}
        </h2>
        {/* 
            But this next interpolation is more interesting: 
            the `children` will be __other React components__
            any number of them, any type.
        */}
        {this.props.children}
      </div>
    );
  }
});

var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList />
        <CommentForm />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    return (
      <div className="commentList">
        {/* 
            Now, when we create some Comments in the list, 
            we define some props for each:
        */}
        <Comment author="Pete Hunt">This is one comment</Comment>
        <Comment author="Jaamal Walker">This is *another* comment</Comment>
        {/* 
            Note that child text nodes like "This is one comment"
            will be automatically turned into a <span> component,
            and available as props.children. Try removing `{this.props.children}` 
            from the Comment component and see what happens.
            In this way, we've added this.props.author ("Pete Hunt"), 
            and this.props.children (the span component) on the instance. 
        */}
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
