
import React, {useState, useEffect} from "react";

const SearchForm = ({ onFormSubmit }) => {

  const [ searchTerm, setSearchTerm ] = useState("")

  return (
    <form onSubmit={onFormSubmit}>
      <input
        type="text"
        placeholder="검색어를 입력해주세요"
        value={searchTerm}
      />
    </form>
  )

}