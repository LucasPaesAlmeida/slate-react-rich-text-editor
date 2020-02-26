import React from "react";

const UnorderedListElement = props => {
  return (
    <ul {...props.attributes}>
      <li>{props.children}</li>
    </ul>
  );
};

export default UnorderedListElement;
