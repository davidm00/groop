import React from "react";
import "./SearchForm.css"

// Add item form component
// adds new item to data list
export default function SearchForm({ searchFormOnSubmit, searchFormOnClear }) {
  return (
    <form onSubmit="false" className="searchForm">
      <input className="searchFormInput" type="text" id="title" placeholder="Search for a list..."></input>
      <br />
      <button className="searchFormButton" variant="submit" onClick={(e) => {
        searchFormOnSubmit(e);
      }}>Search</button>
      <button className="searchFormButton" variant="standard" onClick={(e) => {
        searchFormOnClear(e);
      }}>Clear</button>
    </form>
  );
}
