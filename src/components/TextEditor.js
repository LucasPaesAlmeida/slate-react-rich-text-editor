import React, { useCallback, useMemo, useState } from "react";
import { createEditor, Editor, Transforms } from "slate";
import { CodeElement, DefaultElement } from "../components";

import { Slate, Editable, withReact } from "slate-react";

const TextEditor = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph" }]
    }
  ]);

  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const onKeyDown = (event, editor) => {
    if (event.ctrlKey && event.key === "'") {
      event.preventDefault();
      const [match] = Editor.nodes(editor, {
        match: n => n.type === "code"
      });

      Transforms.setNodes(
        editor,
        { type: match ? "paragraph" : "code" },
        { match: n => Editor.isBlock(editor, n) }
      );
    }
  };

  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <Editable
        renderElement={renderElement}
        onKeyDown={event => {
          onKeyDown(event, editor);
        }}
      />
    </Slate>
  );
};

export default TextEditor;
