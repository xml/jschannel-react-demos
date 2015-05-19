/* 
For our comment box example, we'll have the following component structure:

- CommentBox
  - CommentList
    - Comment
  - CommentForm

*/

var commentData = [
  {author: "Pete Hunt", text: "This is one comment"},
  {author: "Jordan Walke", text: "This is *another* comment"}
];

var Comment = React.createClass({
  render: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});

var CommentBox = React.createClass({
  // getInitialState() is a default React method, like render(). 
  // It's how you establish any State variables that will be monitored for
  // changes by the component. It fires automatically at creation time.
  // The difference between state and props is crucial. See render() for detail
  getInitialState: function() {
    return {commentData: []};
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        {/* 
            And here, we pass the Commentbox's *state* data 
            into the CommentList, but as a *prop*. The one is mutable. 
            The other is not! Thus, updating CommentBox.state.commentData
            will result in a simple re-render on CommentBox. But that 
            *re-creates* the CommentList from scratch, with immutable data.
        */}
        <CommentList commentData={this.state.commentData} />
        <CommentForm />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.commentData.map(function (comment) {
      return (
        <Comment author={comment.author}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
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
  <CommentBox commentData={commentData} />,
  document.getElementById('content')
);
