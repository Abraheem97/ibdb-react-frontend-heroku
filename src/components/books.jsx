import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";
import SearchBox from "./searchBox";
import InfiniteScroll from "react-infinite-scroll-component";
import ClipLoader from "react-spinners/ClipLoader";

class Books extends Component {
  state = {
    books: [],
    searchQuery: "",
    suggesstions: [],
    currentIndex: 0,
    numOfBooks: 6,
    loading: true,
  };

  imageStyles = {
    width: 250,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };
  textCenter = {
    textAlign: "center",
  };

  componentDidMount() {
    fetch(
      `${process.env.REACT_APP_API_URL}/books/${this.state.currentIndex}/${this.state.numOfBooks}`
    )
      .then((res) => res.json())
      .then((data) => {
        this.setState({ books: data });
      });
  }
  fetchMoreData = () => {
    this.setState({
      currentIndex: this.state.currentIndex + this.state.numOfBooks,
      loading: true,
    });
    fetch(
      `${process.env.REACT_APP_API_URL}/books/${this.state.currentIndex}/${this.state.numOfBooks}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length == 0) {
          this.setState({ loading: false });
        }
        setTimeout(() => {
          this.setState({ books: this.state.books.concat(data) });
        }, 850);
      });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query });
  };

  getSearch = () => {
    const { books, searchQuery } = this.state;

    let filteredBooks = books.filter((book) => {
      return book.title.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1;
    });

    return filteredBooks;
  };

  render() {
    return (
      <React.Fragment>
        {!this.props.isLoggedIn && (
          <div
            className="box container"
            style={{
              paddingBottom: 20,
              boxShadow: "0px 3px 0px 0px rgba(0, 0, 0, 0.05)",
            }}
          >
            <h1> Your Favourite Books Reviewed!</h1>
            <p>
              IBDB is international books review site, here you can find books
              of all genres and authors and give those books a review very
              easily.
            </p>
            <p style={{ paddingTop: 10 }}>
              <Link to="/signup">
                <button>Sign up</button>
              </Link>
            </p>

            <p>
              <Link to="/login">
                <button>Sign in</button>
              </Link>
            </p>
          </div>
        )}

        <SearchBox
          value={this.state.searchQuery}
          onChange={this.handleSearch}
          books={this.getSearch()}
        />
        <InfiniteScroll
          style={{ overflow: "none" }}
          dataLength={this.state.books.length}
          next={this.fetchMoreData}
          hasMore={this.state.loading}
          loader={
            <div
              className="sweet-loading"
              style={{ display: "flex", justifyContent: "center", margin: 10 }}
            >
              <ClipLoader
                size={50}
                color={"#123abc"}
                loading={this.state.loading}
              />
            </div>
          }
        >
          <div className="row align-items-start">
            {this.getSearch().map((book) => (
              <div
                key={book.id}
                className="col-sm-6 col-md-4"
                style={{ paddingBottom: 20 }}
              >
                <div style={this.textCenter}>
                  <p>
                    <Link
                      to={`/books/${book.id}`}
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      {book.title}
                    </Link>
                  </p>
                  <div className="caption">
                    <Link to={`/books/${book.id}`}>
                      <img
                        onClick={this.openBook}
                        className="mimg"
                        style={this.imageStyles}
                        src={book.image_url}
                        // src={`${process.env.REACT_APP_API_URL}/assets/${book.image_file_name}`}
                        alt="bookcover.jpg"
                      />
                    </Link>
                    <br style={this.textCenter}></br>
                    By {book.author_name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </React.Fragment>
    );
  }
}

export default Books;
