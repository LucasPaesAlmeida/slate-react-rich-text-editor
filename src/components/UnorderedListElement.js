import React from "react";

const UnorderedListElement = props => {
  return <ul {...props.attributes}>{props.children}</ul>;
};

export default UnorderedListElement;
