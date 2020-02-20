import React, { useCallback, useMemo, useState } from "react";
import { createEditor, Transforms, Editor, Text } from "slate";
import { CodeElement, DefaultElement, Leaf } from "../components";

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
      case "'": {
        event.preventDefault();
        const [match] = Editor.nodes(editor, {
          match: n => n.type === "code"
        });

        Transforms.setNodes(
          editor,
          { type: match ? "paragraph" : "code" },
          { match: n => Editor.isBlock(editor, n) }
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

  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <Editable
        renderLeaf={renderLeaf}
        renderElement={renderElement}
        onKeyDown={event => {
          onKeyDown(event);
        }}
      />
    </Slate>
  );
};

export default TextEditor;
