import React, { Component } from "react";
import TimeAgo from "react-timeago";

class Comment extends Component {
  render() {
    let comment = this.props.comment;

    return (
      <React.Fragment>
        <h3>
          <img
            src="http://localhost:3001/assets/missing.png"
            alt="avatar"
            style={{ height: 59, width: 59 }}
          />
          User says
        </h3>
        {comment.body}
        <p>
          <TimeAgo date={comment.created_at} />
        </p>
        {this.props.replies &&
          this.props.replies.map(comment => (
            <div key={comment.id} style={{ paddingLeft: 40, paddingTop: 20 }}>
              <Comment
                comments={this.props.comments}
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
