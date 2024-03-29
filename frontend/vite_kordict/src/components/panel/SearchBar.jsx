
import React, {useState, useEffect} from "react";
import "./styles/search-bar-styles.css";

const SearchBar = ({ updateSearchParamsFunction }) => {

  const [ boxContent, setBoxContent ] = useState("");
  const [ dictionary, setDictionary ] = useState("korean");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    updateSearchParamsFunction({
      "search_term": boxContent,
      "dictionary": dictionary,
    });
  }

  return (
    <div>
      <button className = { dictionary === "korean" ? "activated-button" : "not-activated-button"}
              onClick = { () => setDictionary("korean") }>
        한
      </button>
      <button className = { dictionary === "hanja" ? "activated-button" : "not-activated-button"}
              onClick = { () => setDictionary("hanja") }>
        漢
      </button>

      <form id="form_content" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="검색어를 입력해주세요"
          value={boxContent}
          onChange={(e) => { setBoxContent(e.target.value) }}
          onKeyDown={(e) => { if(e.key == "Enter") handleSubmit(e)}}
        />
        <button type="submit">검색</button>
      </form>
    </div>
  )
}

export default SearchBar;