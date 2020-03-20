import React, { Component } from "react";
import { getAuthor } from "../Services/bookService";
import { Link } from "react-router-dom";

import { getAuthorBooks } from "../Services/authorService";

class Author extends Component {
  state = { author: {}, books: [] };
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
      getAuthorBooks(resp.id).then(res => this.setState({ books: res }));
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
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR1h2eGaVPEi-Q43WW5U2Hik2u4siY0hY-CnZBNg9dHZU1fFBEq"
                alt="Author_Headshot"
              />
            </div>
          </div>
          <div className="col-md-7 col-md-offset-1">
            <h1 style={this.textCenter}>Description </h1>
            <div className="jumbotron">{author.description}</div>
          </div>
        </div>
        <h4 style={this.textCenter}>All Books from this author</h4>
        <div className="row align-items-start">
          {this.state.books.map(book => (
            <div key={book.id} className="col-sm-6 col-md-4 p-3">
              <div style={this.textCenter}>
                <h5>
                  <Link to={`/books/${book.id}`}>{book.title}</Link>
                </h5>
                <div className="caption">
                  <Link to={`/books/${book.id}`}>
                    <img
                      onClick={this.openBook}
                      className="mimg"
                      style={this.imageStyles}
                      src="https://damonza.com/wp-content/uploads/portfolio/nonfiction/Set%20For%20Life%202.jpg"
                      // src={`${process.env.REACT_APP_API_URL}/assets/${book.image_file_name}`}
                      alt="bookcover.jpg"
                    />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default Author;
