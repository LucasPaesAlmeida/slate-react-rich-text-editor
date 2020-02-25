import React from "react";
import "./style.css";

const FormatToolbar = props => {
  return (
    <div {...props.attributes} className="format-toolbar">
      {props.children}
    </div>
  );
};

export default FormatToolbar;
