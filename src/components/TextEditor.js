import React, { useState, useMemo, useCallback } from "react";
import { createEditor } from "slate";
import { Slate, withReact, Editable } from "slate-react";
import { withHistory } from "slate-history";

import isHotkey from "is-hotkey";

import Toolbar from "components/Toolbar";
import ToolbarItem from "components/ToobarItem";

import { CustomEditor, Element, Leaf } from "Utils/TextEditor";

const ITEMS_MARK = [
  { name: "bold", icon: "bold", type: "mark" },
  { name: "italic", icon: "italic", type: "mark" },
  { name: "underline", icon: "underline", type: "mark" },
  { name: "heading-one", icon: "heading", type: "block" },
  { name: "code", icon: "code", type: "block" },
  { name: "block-quote", icon: "quote right", type: "block" },
  { name: "bulleted-list", icon: "list", type: "block" },
  { name: "numbered-list", icon: "list ol", type: "block" }
];

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline"
};

export default function TextEditor() {
  // Create a Slate editor object that won't change across renders.
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const renderElement = useCallback(props => <Element {...props} />, []);

  // Define a leaf rendering function that is memoized with `useCallback`.
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);

  const [value, setValue] = useState(
    JSON.parse(localStorage.getItem("content")) || [
      {
        type: "paragraph",
        children: [{ text: "A line of text in a paragraph." }]
      }
    ]
  );

  // Forces ToolbarItem re-render on change active prop
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  function handleToolbar(editor, button, type) {
    if (type === "mark") {
      CustomEditor.toggleMark(editor, button);
    }
    if (type === "block") {
      CustomEditor.toggleBlock(editor, button);
    }
    forceUpdate();
  }

  function verifyActiveItem(editor, button, type) {
    if (type === "mark") {
      return CustomEditor.isMarkActive(editor, button);
    }
    if (type === "block") {
      return CustomEditor.isBlockActive(editor, button);
    }
    return null;
  }

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={value => {
        setValue(value);
        const content = JSON.stringify(value);
        localStorage.setItem("content", content);
      }}>
      <Toolbar>
        {ITEMS_MARK.map(({ name, icon, type }, key) => (
          <ToolbarItem
            key={key}
            name={icon}
            active={verifyActiveItem(editor, name, type)}
            onClick={() => handleToolbar(editor, name, type)}
          />
        ))}
      </Toolbar>
      <Editable
        editor={editor}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder='Insert text here'
        spellCheck
        autoFocus
        onKeyDown={e => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, e)) {
              e.preventDefault();
              const mark = HOTKEYS[hotkey];
              handleToolbar(editor, mark, "mark");
              forceUpdate();
            }
          }
        }}
      />
    </Slate>
  );
}
