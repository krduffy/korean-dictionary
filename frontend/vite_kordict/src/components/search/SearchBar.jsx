
import React, {useState, useEffect} from "react";

const SearchBar = ({ updateSearchParamsFunction }) => {

  const [ boxContent, setBoxContent ] = useState("");
  const [ dictionary, setDictionary ] = useState("kor");
  const [ searchType, setSearchType ] = useState("startswith")

  const handleSubmit = (e) => {
    console.log("kkkkkkkkkkkkk");
    e.preventDefault();
    updateSearchParamsFunction({
      "search_term": boxContent,
      "search_type": searchType,
    });
  }

  return (
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
  )
}

export default SearchBar;