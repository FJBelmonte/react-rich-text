import React, { useState, useMemo, useEffect, useCallback } from "react";
import { createEditor, Editor, Transforms, Text, Node } from "slate";
import { Slate, withReact, Editable } from "slate-react";

import Toolbar from "components/Toolbar";

import { CustomEditor } from "Utils/CustomEditor";

const ITEMS = [
  { name: "bold", active: false },
  { name: "italic", active: false },
  { name: "underline", active: false },
  { name: "code", active: false },
  { name: "quote right", active: false },
  { name: "list", active: false },
  { name: "list ol", active: false }
];

// Define a serializing function that takes a value and returns a string.
const serialize = value => {
  return (
    value
      // Return the string content of each paragraph in the value's children.
      .map(n => Node.string(n))
      // Join them all with line breaks denoting paragraphs.
      .join("\n")
  );
};

// Define a deserializing function that takes a string and returns a value.
const deserialize = string => {
  // Return a value array of children derived by splitting the string.
  return string.split("\n").map(line => {
    return {
      children: [{ text: line }]
    };
  });
};

export default function TextEditor() {
  // Create a Slate editor object that won't change across renders.
  const editor = useMemo(() => withReact(createEditor()), []);

  const [value, setValue] = useState(
    deserialize(localStorage.getItem("content") || "")
  );

  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  function handleToolbar(button, editor) {
    switch (button) {
      case "bold":
      case "italic":
      case "underline":
        CustomEditor.toggleMark(editor, button);
        break;
    }
  }

  // Define a leaf rendering function that is memoized with `useCallback`.
  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />;
  }, []);

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={value => {
        setValue(value);
        localStorage.setItem("content", serialize(value));
      }}>
      <div>
        <Toolbar
          items={ITEMS}
          onClick={name => {
            handleToolbar(name, editor);
          }}
        />
        <button
          onMouseDown={event => {
            event.preventDefault();
            CustomEditor.toggleBoldMark(editor);
          }}>
          Bold
        </button>
        <button
          onMouseDown={event => {
            event.preventDefault();
            CustomEditor.toggleCodeBlock(editor);
          }}>
          Code Block
        </button>
      </div>
      <Editable
        editor={editor}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={event => {
          if (!event.ctrlKey) {
            return;
          }

          switch (event.key) {
            case "`": {
              event.preventDefault();
              CustomEditor.toggleCodeBlock(editor);
              break;
            }

            case "b": {
              event.preventDefault();
              CustomEditor.toggleBoldMark(editor);
              break;
            }
          }
        }}
      />
    </Slate>
  );
}

const CodeElement = props => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const DefaultElement = props => {
  return <p {...props.attributes}>{props.children}</p>;
};

const Leaf = ({ attributes, leaf, children }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.code) {
    children = <code>{children}</code>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  return <span {...attributes}>{children}</span>;
};
