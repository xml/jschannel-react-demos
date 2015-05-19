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
  /* 
    componentDidMount() is a default React method. It fires after component 
    creation is complete. Because it fires after creation, it must operate
    on state, not props.
  */
  componentDidMount: function() {
    // obtain our data, using JQuery.
    this.loadCommentsFromServer();
    // refresh the data on an interval:
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  // our own custom method for data loading:
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        // CRITICAL: once the data is obtained, update the component's
        // *state* with it. Which will trigger a re-render. 
        this.setState({commentData: data});
      }.bind(this), // making sure that 'this' will mean the CommentBox
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this) // making sure that 'this' will mean the CommentBox
    });
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList commentData={this.state.commentData}/>
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

/* 
  Rather than explicitly passing a data array, we now just pass a URL, 
  and allow the component to obtain its own data.
  NOTE: the server must be up and running for this to work.
  Also, the pollInterval means you can modify comments.json, and
  should see the browser update automagically. Try it!
*/
React.render(
  <CommentBox url="comments.json"  pollInterval={2000} />,
  document.getElementById('content')
);

