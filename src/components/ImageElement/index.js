import React from "react";

import "./styles.css";

const ImageElement = ({ attributes, children, element }) => {
  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <img
          src={element.url}
          alt={element.description}
          className="editor-image"
        />
      </div>
      {children}
    </div>
  );
};

export default ImageElement;
