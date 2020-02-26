import React, { useCallback, useMemo, useState } from "react";
import { createEditor, Transforms, Editor, Text } from "slate";
import {
  CodeElement,
  DefaultElement,
  Leaf,
  FormatToolbar,
  OrderedListElement,
  UnorderedListElement
} from "../components";

import { Slate, Editable, withReact } from "slate-react";

import Icon from "react-icons-kit";
import { ic_format_bold } from "react-icons-kit/md/ic_format_bold";
import { ic_format_italic } from "react-icons-kit/md/ic_format_italic";
import { ic_format_underlined } from "react-icons-kit/md/ic_format_underlined";
import { ic_format_list_numbered } from "react-icons-kit/md/ic_format_list_numbered";
import { ic_format_list_bulleted } from "react-icons-kit/md/ic_format_list_bulleted";
import { ic_code } from "react-icons-kit/md/ic_code";

const TextEditor = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph" }]
    }
  ]);

  const defaultIconSize = 26;

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
      case "u": {
        event.preventDefault();
        toggleMark("underline");
        break;
      }
      case "'": {
        event.preventDefault();
        transformElement("code");
        break;
      }
      case "o": {
        event.preventDefault();
        transformElement("orList");
        break;
      }
      case "l": {
        event.preventDefault();
        transformElement("unList");
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

  const onElementClick = (e, type) => {
    e.preventDefault();
    transformElement(type);
  };

  const transformElement = element => {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === element
    });

    Transforms.setNodes(
      editor,
      { type: match ? "default" : element },
      { match: n => Editor.isBlock(editor, n) }
    );
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
      case "orList":
        return <OrderedListElement {...props} />;
      case "unList":
        return <UnorderedListElement {...props} />;
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
          <Icon size={defaultIconSize} icon={ic_format_bold} />
        </button>
        <button
          onPointerDown={e => onMarkClick(e, "italic")}
          className="tooltip-icon-button"
        >
          <Icon size={defaultIconSize} icon={ic_format_italic} />
        </button>
        <button
          onPointerDown={e => onMarkClick(e, "underline")}
          className="tooltip-icon-button"
        >
          <Icon size={defaultIconSize} icon={ic_format_underlined} />
        </button>
        <button
          onPointerDown={e => onElementClick(e, "code")}
          className="tooltip-icon-button"
        >
          <Icon size={defaultIconSize} icon={ic_code} />
        </button>
        <button
          onPointerDown={e => onElementClick(e, "orList")}
          className="tooltip-icon-button"
        >
          <Icon size={defaultIconSize} icon={ic_format_list_numbered} />
        </button>
        <button
          onPointerDown={e => onElementClick(e, "unList")}
          className="tooltip-icon-button"
        >
          <Icon size={defaultIconSize} icon={ic_format_list_bulleted} />
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
