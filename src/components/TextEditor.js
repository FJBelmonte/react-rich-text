import React, { useState, useMemo, useCallback } from "react";
import { createEditor } from "slate";
import { Slate, withReact, Editable } from "slate-react";
import { withHistory } from "slate-history";

import isHotkey from "is-hotkey";

import Toolbar from "components/Toolbar";
import ToolbarItem from "components/ToobarItem";

import {
  CustomEditor,
  Element,
  Leaf,
  serialize,
  deserialize
} from "Utils/TextEditor";

const ITEMS_MARK = ["bold", "italic", "underline"];

const ITEMS_BLOCK = ["heading", "code", "quote right", "list", "list ol"];

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
    deserialize(localStorage.getItem("content") || "")
  );

  // Forces ToolbarItem re-render on change active prop
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  function handleToolbar(editor, button) {
    switch (button) {
      case "bold":
      case "italic":
      case "underline":
        CustomEditor.toggleMark(editor, button);
        forceUpdate();
        break;
      case "code":
      case "list ol":
      case "quote right":
      case "list":
      case "heading":
        CustomEditor.toggleBlock(editor, button);
        forceUpdate();
        break;

      default:
        console.log(button);
        break;
    }
  }

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={value => {
        setValue(value);
        localStorage.setItem("content", serialize(value));
      }}>
      <Toolbar>
        {ITEMS_MARK.map((item, key) => (
          <ToolbarItem
            key={key}
            name={item}
            active={CustomEditor.isMarkActive(editor, item)}
            onClick={() => handleToolbar(editor, item)}
          />
        ))}
        {ITEMS_BLOCK.map((item, key) => (
          <ToolbarItem
            key={key}
            name={item}
            active={CustomEditor.isBlockActive(editor, item)}
            onClick={() => handleToolbar(editor, item)}
          />
        ))}
      </Toolbar>
      <Editable
        editor={editor}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        spellCheck
        autoFocus
        onKeyDown={e => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, e)) {
              e.preventDefault();
              const mark = HOTKEYS[hotkey];
              CustomEditor.toggleMark(editor, mark);
              forceUpdate();
            }
          }
        }}
      />
    </Slate>
  );
}
