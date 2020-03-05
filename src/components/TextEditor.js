import React, { useCallback, useMemo, useState } from "react";
import { createEditor, Transforms, Editor, Text } from "slate";

import { Slate, Editable, withReact } from "slate-react";

import {
  CodeElement,
  DefaultElement,
  Leaf,
  FormatToolbar,
  OrderedListElement,
  UnorderedListElement,
  ListItem,
  ImageElement
} from "../components";

import withImages, { insertImage } from "../helpers/WithImages";

import Icon from "react-icons-kit";
import { ic_format_bold } from "react-icons-kit/md/ic_format_bold";
import { ic_format_italic } from "react-icons-kit/md/ic_format_italic";
import { ic_format_underlined } from "react-icons-kit/md/ic_format_underlined";
import { ic_format_list_numbered } from "react-icons-kit/md/ic_format_list_numbered";
import { ic_format_list_bulleted } from "react-icons-kit/md/ic_format_list_bulleted";
import { ic_code } from "react-icons-kit/md/ic_code";
import { ic_image } from "react-icons-kit/md/ic_image"

const TextEditor = () => {
  const editor = useMemo(() => withImages(withReact(createEditor())), []);
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "" }]
    }
  ]);

  const HOTKEYS = {
    b: () => toggleMark("bold"),
    i: () => toggleMark("italic"),
    u: () => toggleMark("underline"),
    "'": () => transformBlock("code"),
    o: () => transformBlock("ordered-list"),
    l: () => transformBlock("bulleted-list")
  };

  const DEFAULT_ICON_SIZE = 26;
  const LIST_TYPES = ["ordered-list", "bulleted-list"];

  const onKeyDown = event => {
    if (!event.ctrlKey) return;

    if (HOTKEYS[event.key] !== undefined) {
      event.preventDefault();
      HOTKEYS[event.key]();
    }
  };

  const onMarkClick = (e, type) => {
    e.preventDefault();
    toggleMark(type);
  };

  const onElementClick = (e, type) => {
    e.preventDefault();
    transformBlock(type);
  };

  const promptForImage = () => {
    const url = window.prompt('Enter the URL of the image:')
    if (!url) return
      insertImage(editor, url)
  }

  const transformBlock = element => {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === element
    });

    const isList = LIST_TYPES.includes(element);

    Transforms.unwrapNodes(editor, {
      match: n => LIST_TYPES.includes(n.type),
      split: true
    });

    Transforms.setNodes(
      editor,
      { type: match ? "default" : isList ? "list-item" : element },
      { match: n => Editor.isBlock(editor, n) }
    );

    if (!match && isList)
      Transforms.wrapNodes(editor, { type: element, children: [] });
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
      case "ordered-list":
        return <OrderedListElement {...props} />;
      case "bulleted-list":
        return <UnorderedListElement {...props} />;
      case "list-item":
        return <ListItem {...props} />;
      case "image":
        return <ImageElement {...props} />;
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
          <Icon size={DEFAULT_ICON_SIZE} icon={ic_format_bold} />
        </button>
        <button
          onPointerDown={e => onMarkClick(e, "italic")}
          className="tooltip-icon-button"
        >
          <Icon size={DEFAULT_ICON_SIZE} icon={ic_format_italic} />
        </button>
        <button
          onPointerDown={e => onMarkClick(e, "underline")}
          className="tooltip-icon-button"
        >
          <Icon size={DEFAULT_ICON_SIZE} icon={ic_format_underlined} />
        </button>
        <button
          onPointerDown={e => onElementClick(e, "code")}
          className="tooltip-icon-button"
        >
          <Icon size={DEFAULT_ICON_SIZE} icon={ic_code} />
        </button>
        <button
          onPointerDown={e => onElementClick(e, "ordered-list")}
          className="tooltip-icon-button"
        >
          <Icon size={DEFAULT_ICON_SIZE} icon={ic_format_list_numbered} />
        </button>
        <button
          onPointerDown={e => onElementClick(e, "bulleted-list")}
          className="tooltip-icon-button"
        >
          <Icon size={DEFAULT_ICON_SIZE} icon={ic_format_list_bulleted} />
        </button>
        <button
          onPointerDown={e => {e.preventDefault(); promptForImage()}}
          className="tooltip-icon-button"
        >
          <Icon size={DEFAULT_ICON_SIZE} icon={ic_image} />
        </button>
      </FormatToolbar>
      <Editable
        placeholder="Digite o seu texto."
        spellCheck
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
