import React from "react";

const Href = ({ link, innerText }) => {
    return (
        <a href={link} target="_blank" rel="noopener noreferrer">
            {innerText}
        </a>
    );
};

export default Href;
