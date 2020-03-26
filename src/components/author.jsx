import React, { Component } from "react";
import { getAuthor } from "../Services/bookService";
import { Link } from "react-router-dom";

import { getAuthorBooks } from "../Services/authorService";

class Author extends Component {
  state = { author: {}, books: [] };
  imageStyles = {
    width: 300,
    height: 340,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center"
  };

  booksImageStyles = {
    width: 250,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer"
  };

  textCenter = {
    textAlign: "center"
  };

  componentDidMount() {
    getAuthor(parseInt(this.props.match.params.id)).then(resp => {
      getAuthorBooks(resp.id).then(res => this.setState({ books: res }));
      this.setState({ author: resp });
    });
  }

  render() {
    const { author } = this.state;
    return (
      <React.Fragment>
        <div className="row">
          <div className="col">
            <div style={this.textCenter}>
              <div className="caption">
                <br></br>
                <h3>{author.name}</h3>
                <img
                  style={this.booksImageStyles}
                  src={author.image_url}
                  alt="Author_Headshot"
                />
              </div>
            </div>
          </div>
          <div style={{ padding: 40 }} className="col-md-7 col-md-offset-1">
            <h2 style={this.textCenter}>Description </h2>
            <div className="box">{author.description}</div>
          </div>
        </div>

        <h4 style={{ textAlign: "center", padding: 50 }}>
          All Books from this author
        </h4>

        <div className="row align-items-start">
          {this.state.books.map(book => (
            <div
              key={book.id}
              style={{ marginBottom: 40 }}
              className="col-sm-6 col-md-4"
            >
              <div style={this.textCenter}>
                <h5>
                  <Link to={`/books/${book.id}`}>{book.title}</Link>
                </h5>
                <div className="caption">
                  <Link to={`/books/${book.id}`}>
                    <img
                      onClick={this.openBook}
                      className="mimg"
                      style={this.booksImageStyles}
                      src={book.image_url}
                      // src={`${process.env.REACT_APP_API_URL}/assets/${book.image_file_name}`}
                      alt="bookcover.jpg"
                    />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <br />
        <br />
      </React.Fragment>
    );
  }
}

export default Author;
