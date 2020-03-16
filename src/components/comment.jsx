import React, { Component } from "react";
import TimeAgo from "react-timeago";

class Comment extends Component {
  render() {
    let comment = this.props.comment;
    console.log("the comment" + comment.id, this.props.replies[0]);
    return (
      <React.Fragment>
        <h3>User says </h3>
        {comment.body}
        <p>
          <TimeAgo date={comment.created_at} />
        </p>
        {this.props.replies &&
          this.props.replies.map(comment => (
            <div style={{ paddingLeft: 40, paddingTop: 20 }}>
              <Comment
                comments={this.props.comments}
                key={comment.id}
                comment={comment}
                replies={this.props.comments.filter(
                  reply => reply.parent_id === comment.id
                )}
              />
            </div>
          ))}
      </React.Fragment>
    );
  }
}

export default Comment;
