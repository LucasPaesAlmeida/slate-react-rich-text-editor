import React, { useCallback, useMemo, useState } from "react";
import { createEditor, Transforms, Editor, Text } from "slate";
import Leaf from "./Leaf";
import { Slate, Editable, withReact } from "slate-react";

const TextEditor = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph" }]
    }
  ]);

  const onKeyDown = event => {
    if (!event.ctrlKey) return;

    switch (event.key) {
      case "b": {
        event.preventDefault();
        const [match] = Editor.nodes(editor, {
          match: n => n.bold
        });

        Transforms.setNodes(
          editor,
          { bold: match ? false : true },
          { match: n => Text.isText(n), split: true }
        );
        break;
      }
      default:
        return;
    }
  };

  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />;
  }, []);

  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <Editable
        renderLeaf={renderLeaf}
        onKeyDown={event => {
          onKeyDown(event);
        }}
      />
    </Slate>
  );
};

export default TextEditor;
