import React, { Component } from "react";
import { getAuthor } from "../Services/bookService";

class Author extends Component {
  state = { author: {} };
  imageStyles = {
    width: 250,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center"
  };

  textCenter = {
    textAlign: "center"
  };

  componentDidMount() {
    getAuthor(parseInt(this.props.match.params.id)).then(resp => {
      this.setState({ author: resp });
    });
  }
  render() {
    const { author } = this.state;
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-sm-7 col-md-4" style={this.textCenter}>
            <div className="caption">
              <h4>{author.name}</h4>
              <img
                style={this.imageStyles}
                src={`http://localhost:3001/assets/${author.image_file_name}`}
                alt="Author_Headshot"
              />
            </div>
          </div>
          <div className="col-md-7 col-md-offset-1">
            <h1 style={this.textCenter}>Description </h1>
            <div className="jumbotron">{author.description}</div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Author;
