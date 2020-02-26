import React from "react";

const OrderedListElement = props => {
  return (
    <ol {...props.attributes}>
      <li>{props.children}</li>
    </ol>
  );
};

export default OrderedListElement;
