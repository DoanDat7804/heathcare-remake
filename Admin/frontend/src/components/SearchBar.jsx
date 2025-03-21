import React from "react";
import "../assets/SearchBar.css";

const SearchBar = ({ searchTerm, setSearchTerm, placeholder = "Tìm kiếm..." }) => {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;