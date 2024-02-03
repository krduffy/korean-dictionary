
import React, {useState, useEffect} from "react";

const SearchBar = ({ onFormSubmit }) => {

  const [ boxContent, setBoxContent ] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(boxContent);
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