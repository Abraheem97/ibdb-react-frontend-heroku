import React from "react";

const SearchBox = ({ value, onChange }) => {
  return (
    <React.Fragment>
      <input
        autoComplete="off"
        type="text"
        name="query"
        className="form-control my-3"
        placeholder="Search Books By Title or Author Name..."
        value={value}
        onChangeCapture={(e) => {
          onChange(e.currentTarget.value);
        }}
        style={{ background: "none" }}
        id="selector"
      />
      {/* <ul>
        {books.map(book => (
          <li>{book.title}</li>
        ))}
      </ul> */}
    </React.Fragment>
  );
};

export default SearchBox;
