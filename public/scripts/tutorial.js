/* 
For our comment box example, we'll have the following component structure:

- CommentBox
  - CommentList
    - Comment
  - CommentForm

*/

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
  getInitialState: function() {
    return {commentData: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({commentData: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  handleCommentSubmit: function(comment) {
    // Send the new comment back to the server. Nothing fancy.
    // Warning: the server will write to the JSON file. You'll need to stash
    // or reset changes to that, in order to progress to the next commit. 
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({commentData: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList commentData={this.state.commentData}/>
      {/* There's not actually an event called 'onCommentSubmit'. Rather,
          we're creating a prop with that name on the CommentForm component, 
          and assigning to it a reference to the CommentBox's 
          handleCommentSubmit method. This way, we can notify the CommentBox
          about new comments, allowing the CommentBox to be the custodian
          of our Comment data.
      */}
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
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
  handleSubmit: function(e) {
    e.preventDefault();
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();
    if (!text || !author) {
      return;
    }
    // from the form, notify CommentBox about new comment values:
    this.props.onCommentSubmit({author: author, text: text});

    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
    return;
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <h2 className="commentForm__header">Post a New Comment</h2>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text"/>
        <input type="submit" value="Post" />
      </form>
    );
  }
});

React.render(
  <CommentBox url="comments.json"  pollInterval={2000} />,
  document.getElementById('content')
);

