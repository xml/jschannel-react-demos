/* 
For our comment box example, we'll have the following component structure:

- CommentBox
  - CommentList
    - Comment
  - CommentForm

*/

// First, define the main 'CommentBox' element:
var CommentBox = React.createClass({
  render: function() {
    /*  
      render() is the fundamental React method. It tells React what children 
      our component has, and assigns those children data props and other
      React attributes.

      Remember that this HTML/XML will be compiled to Javascript before runtime.
      Read more about JSX at: 
      https://facebook.github.io/react/docs/jsx-in-depth.html
    */
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        {/* 
          Here's where we invoke CommentBox's child components, defined below.
          
          We pass the Commentbox's *state* data into the CommentList, 
          but as a *prop*. The one (state) is mutable. The other (prop) 
          is not! Thus, updating CommentBox.state.commentData
          will result in a simple re-render on CommentBox. But that 
          *re-creates* the CommentList from scratch, with immutable data.

          (Note the special syntax we're using here for child comments in 
          JSX, wrapping the comment in curly-brackets.)
        */}
        <CommentList commentData={this.state.commentData}/>

        {/* 
          There's not actually an event called 'onCommentSubmit'. Rather,
          we're creating a prop with that name on the CommentForm component, 
          and assigning to it a reference to the CommentBox's 
          handleCommentSubmit method. This way, we can notify the CommentBox
          about new comments, allowing the CommentBox to be the custodian
          of our Comment data.
        */}
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  },
  getInitialState: function() {
    /* 
      getInitialState() is a default React method, like render(). 
      It's how you establish any State variables that will be monitored for
      changes by the component. It fires automatically at creation time.
      The difference between state and props is crucial. See render() for detail.
    */
    return {commentData: []};
  },
  componentDidMount: function() {
    /* 
      componentDidMount() is a default React method. It fires after component 
      creation is complete. Because it fires after creation, it must operate
      on state, not props.
    */
    // first, obtain our initial data, using JQuery:
    this.loadCommentsFromServer();        
    // then, refresh the data on an interval:
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  loadCommentsFromServer: function() {
    /* Our own custom method for data loading. */
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        // once the data is downloaded, we update the `state` with it:
        this.setState({commentData: data});
      }.bind(this), // making sure that 'this' will mean the CommentBox
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this), // making sure that 'this' will mean the CommentBox
    });
  },
  handleCommentSubmit: function(comment) {
    /*  
      A custom event-handler we've created, to update the view and
      send new comments back to the server. Nothing fancy.
      Warning: the server will write to comments.json. You'll need to stash
      or reset changes to that, in order to move between commits. 
    */

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
        // CRITICAL: once the data is obtained, update the component's
        // *state* with it. Which will trigger a re-render. 
        // A full version of the comments array is returned from POST.
        this.setState({commentData: data});
      }.bind(this),
      error: function(xhr, status, err) {
        // (In an ideal world, we'd delete/flag any optimistically-rendered 
        // comment if the POST operation fails.)
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
});

// These additional React components will be children of CommentBox:
var CommentList = React.createClass({
  render: function() {
    // We need to create a comment component for each member of the data array: 
    // (We're using `map()`, which is the same as `forEach()` or a loop.)
    var commentNodes = this.props.commentData.map(function (comment) {
      return (
        <Comment author={comment.author}>
          {comment.text}
          {/* 
              Note that child text nodes like the interpolation `{comment.text}`
              will be automatically turned into a <span> component,
              and available to the Comment component as props.children. 
              Note that we use `{this.props.children}` in the Comment component 
              to access the text.
          */}

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

    // Read the `.value` of each input, and see if there are changes. 
    // Note that React.findDOMNode() isn't like JQuery: it's finding a React
    // component, then reading its node reference, not searching the DOM. 

    // We use the ref attribute to assign a name to a child component 
    // and this.refs to reference the component.
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();
    if (!text || !author) {
      return;
    }

    // if there is a new comment, pass it 'up' to the CommentBox component:
    this.props.onCommentSubmit({author: author, text: text});

    // Clear the inputs in the DOM. (They're not bound directly to any models,
    // so there's no need to deal with that.)
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
    return;
  },
  render: function() {
    return (
      {/* `onSubmit` is a React-specific event. We assign a handler: */}
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <h2 className="commentForm__header">Post a New Comment</h2>
        {/* We use the `ref` attribute to assign a name to a child component 
            and `this.refs` to reference them in methods. */}
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text"/>
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var Comment = React.createClass({
  render: function() {
    /* 
        We actually want our Comments parsed as Markdown text,
        using the Marked library, which is already active on index.html. 

        BUT, using this code in the component:
          {marked(this.props.children.toString())}
        doesn't work. By default, React just doesn't like HTML strings 
        and won't parse them at runtime. (See: XSS) Remember: React is about 
        composing *everything* in javascript, and JSX is just a way of creating 
        that javascript. So, traditional HTML techniques are harder. 

        Fortunately, React gives us an API for overriding this prejudice, so 
        you can use things like Markdown, with `dangerouslySetInnerHTML`. See:
        https://facebook.github.io/react/tips/dangerously-set-inner-html.html

        And, in Marked, we tell it to sanitize the input for us:
    */
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        {/* Note: any interpolation of text creates a new <p> component. */}
        <div dangerouslySetInnerHTML={{__html: rawMarkup}}></div>
        {/* 
            Note that "{{__html: rawMarkup}}" is *not* an Angular-style double-brackets
            interpolation. It's a React expression containing an object literal. 

            Also note: we're passing our string to Marked and telling it to sanitize
            it's inputs, up before the return statement in this `render()` method.. 
        */}
      </div>
    );
  }
});


// Finally, tell React to instantiate and render our application. 
// We're telling React to:
// 1. Initialize and render() the Component called 'CommentBox'
// 2. Place the rendered component inside the #content element
// 3. Provide 'url' and 'pollInterval' props to the CommentBox, which
//    will be used by it to download its own data. 
React.render(
  <CommentBox url="comments.json"  pollInterval={2000} />,
  document.getElementById('content')
);

