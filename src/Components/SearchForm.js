import { html } from "https://unpkg.com/htm/preact/standalone.module.js";

// Add item form component
// adds new item to data list
export default function SearchForm({ searchFormOnSubmit, searchFormOnClear }) {
  return html`
    <form onSubmit="false" class="searchForm">
      <input class="searchFormInput" type="text" id="title" placeholder="Search for a list..."></input>
      <br />
      <button class="searchFormButton" type="submit" onClick=${(e) => {
        searchFormOnSubmit(e);
      }}>Search</button>
      <button class="searchFormButton" type="submit" onClick=${(e) => {
        searchFormOnClear(e);
      }}>Clear</button>
    </form>
  `;
}
