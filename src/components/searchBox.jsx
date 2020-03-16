import React from "react";

const SearchBox = ({ value, onChange }) => {
  return (
    <input
      autoComplete="off"
      type="text"
      name="query"
      className="form-control my-3"
      placeholder="Search Books..."
      value={value}
      onChange={e => onChange(e.currentTarget.value)}
    />
  );
};

export default SearchBox;
