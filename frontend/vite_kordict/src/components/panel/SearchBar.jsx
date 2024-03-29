
import React, {useState, useContext} from "react";
import { ViewContext } from "./Panel.jsx";
import "./styles/search-bar-styles.css";

const SearchBar = () => {

  const [ boxContent, setBoxContent ] = useState("");
  const [ dictionary, setDictionary ] = useState("korean");

  const setView = useContext(ViewContext)["setCurrentView"];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (boxContent.match(/^[\u4E00-\u9FFF]$/g))
      setView({
          "view": "detail_hanja", 
          "value": boxContent});
    else if (dictionary === "korean")
      setView({
          "view": "search_korean", 
          "value": boxContent});
    else if (dictionary === "hanja")
      setView({
          "view": "search_hanja", 
          "value": boxContent})
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