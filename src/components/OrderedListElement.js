import React from "react";

const OrderedListElement = props => {
  return <ol {...props.attributes}>{props.children}</ol>;
};

export default OrderedListElement;
