import React, { useCallback, useMemo, useState } from "react";
import { createEditor, Transforms, Editor, Text } from "slate";
import {
  CodeElement,
  DefaultElement,
  Leaf,
  FormatToolbar
} from "../components";

import { Slate, Editable, withReact } from "slate-react";

import Icon from "react-icons-kit";
import { bold } from "react-icons-kit/feather/bold";
import { italic } from "react-icons-kit/feather/italic";
import { underline } from "react-icons-kit/feather/underline";
import { list } from "react-icons-kit/feather/list";
import { code } from "react-icons-kit/feather/code";

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
        toggleMark("bold");
        break;
      }
      case "i": {
        event.preventDefault();
        toggleMark("italic");
        break;
      }
      case "s": {
        event.preventDefault();
        toggleMark("underline");
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

  const onMarkClick = (e, type) => {
    e.preventDefault();
    toggleMark(type);
  };

  const toggleMark = useCallback(
    mark => {
      const [match] = Editor.nodes(editor, {
        match: n => n[mark]
      });

      Transforms.setNodes(
        editor,
        { [mark]: match ? false : true },
        { match: n => Text.isText(n), split: true }
      );
    },
    [editor]
  );

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
      <FormatToolbar>
        <button
          onPointerDown={e => onMarkClick(e, "bold")}
          className="tooltip-icon-button"
        >
          <Icon icon={bold} />
        </button>
        <button
          onPointerDown={e => onMarkClick(e, "italic")}
          className="tooltip-icon-button"
        >
          <Icon icon={italic} />
        </button>
        <button
          onPointerDown={e => onMarkClick(e, "underline")}
          className="tooltip-icon-button"
        >
          <Icon icon={underline} />
        </button>
        <button
          onPointerDown={e => onMarkClick(e, "code")}
          className="tooltip-icon-button"
        >
          <Icon icon={code} />
        </button>
        <button
          onPointerDown={e => onMarkClick(e, "list")}
          className="tooltip-icon-button"
        >
          <Icon icon={list} />
        </button>
      </FormatToolbar>
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
