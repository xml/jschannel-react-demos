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
    // For 'Optimistic Updates', we update the state immediately.
    // Start with a reference to the current comments array:
    var comments = this.state.commentData;
    // Make a copy and add the new comment to that:
    var newComments = comments.concat([comment]);
    // then update the state with it, which will render() immediately:
    this.setState({commentData: newComments});
    // ...aaaand, note that it will render *again* after the POST operation
    // returns and fires its callback, thus ensuring consistency. 
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        // We receive a full version of the comments array on POST,
        // with which we update the state.
        this.setState({commentData: data});
      }.bind(this),
      error: function(xhr, status, err) {
        // (In an ideal world, we'd delete/flag any optimistically-rendered 
        // comment if the POST operation fails.)
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList commentData={this.state.commentData}/>
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

