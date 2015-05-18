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
          {/* 
          We actually want our children parsed as Markdown text,
          using the Marked library, which is already active on index.html. 

          BUT, this code:
            {marked(this.props.children.toString())}
          doesn't work, does it? By default, React just doesn't like HTML strings 
          and won't parse them at runtime. (See: XSS) Remember: React is about 
          composing *everything* in javascript, and JSX is just a way of creating 
          that javascript.
          Fortunately, React gives us an API for overriding this prejudice, so 
          you can use things like Markdown, with `dangerouslySetInnerHTML`. See:
          https://facebook.github.io/react/tips/dangerously-set-inner-html.html
          */}
         <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
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
