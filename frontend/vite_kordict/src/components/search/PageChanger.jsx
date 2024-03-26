
import React from "react";
import "./page-changer-styles.css"

const PageChanger = ({ page, numberOfPages, setPageFunction }) => {

  const handleClick = (newPage) => {
    return () => {
      setPageFunction(newPage);
    };
  };

  return (
  <div id="page-changer-container-div">
    {/* gray out the left button if there is no left page*/}
    { page - 1 <= 0 &&
      <button className="page-left-button" id="page-left-button-grayed-out">
        -
      </button>
    }
    { page - 1 > 0 &&
      <button className="page-left-button" id="page-left-button-exists" 
        onClick = {handleClick(page-1)}>
        {page-1}
      </button>
    }

    <div id="page-number-display">
      {page}
    </div>

    {/* gray out the right button if there is no right page*/}
    { page + 1 > numberOfPages &&
      <button className="page-right-button" id="page-right-button-grayed-out">
        -
      </button>
    }
    { page + 1 <= numberOfPages &&
      <button className="page-right-button" id="page-right-button-exists"
        onClick = {handleClick(page+1)}>
          {page+1}
      </button>
    }
  </div>
  );
}

export default PageChanger;