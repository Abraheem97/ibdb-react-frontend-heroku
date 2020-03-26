import React from "react";

const SearchBox = ({ value, onChange, color, books }) => {
  return (
    <React.Fragment>
      <input
        autoComplete="off"
        type="text"
        name="query"
        className="form-control my-3"
        placeholder="Search Books..."
        value={value}
        onChange={e => onChange(e.currentTarget.value)}
        style={{ background: color }}
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
