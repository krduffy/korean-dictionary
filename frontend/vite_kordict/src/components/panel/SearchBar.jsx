
import React, {useState, useEffect} from "react";
import "./styles/search-bar-styles.css";

const SearchBar = ({ updateSearchParamsFunction }) => {

  const [ boxContent, setBoxContent ] = useState("");
  const [ dictionary, setDictionary ] = useState("kor");
  const [ searchType, setSearchType ] = useState("startswith")

  const handleSubmit = (e) => {
    e.preventDefault();
    if (dictionary == "kor")
    {
      updateSearchParamsFunction({
        "search_term": boxContent,
        "dictionary": dictionary,
        "search_type": searchType,
      });
    }

    else if (dictionary == "han")
    {
      let language = "";
      if (boxContent.match(/[\u4E00-\u9FFF]/g))
        language = "han";
      else
        language = "kor";

      updateSearchParamsFunction({
        "search_term": boxContent,
        "dictionary": dictionary,
        "input_language": language,
      });
    }
  }

  return (
    <div>
      <button className = { dictionary === "kor" ? "activated-button" : "not-activated-button"}
              onClick = { () => setDictionary("kor") }>
        한
      </button>
      <button className = { dictionary === "han" ? "activated-button" : "not-activated-button"}
              onClick = { () => setDictionary("han") }>
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