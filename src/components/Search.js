import React from 'react';

const SearchBar = () => (
    <form action="/journal" method="get" style={{display:"flex", justifyContent:"center"}}> 
        <textarea
            type="text"
            id="search"
            placeholder="Search a song, a memory, a place, or a time..."
            name="search" 
            rows="1"
            cols="70"
        />
        <button type="submit">Search</button>
    </form>
);

export default SearchBar;