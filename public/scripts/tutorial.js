/* 
For our comment box example, we'll have the following component structure:

- CommentBox
  - CommentList
    - Comment
  - CommentForm

*/

var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
          {/* We actually want our children parsed as Markdown text,
          using the Marked library, which is already active on index.html: */}
        {marked(this.props.children.toString())}
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
        <Comment author="Pete Hunt">This is one comment</Comment>
        <Comment author="Jaamal Walker">This is *another* comment</Comment>
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
