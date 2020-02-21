import React from "react";
import { Editor, Transforms, Node } from "slate";

const LIST_TYPES = ["numbered-list", "bulleted-list"];

export const CustomEditor = {
  //  Verify if mark is active
  isMarkActive(editor, format) {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  },

  // Toggle mark
  toggleMark(editor, format) {
    const isActive = CustomEditor.isMarkActive(editor, format);

    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  },

  isBlockActive(editor, format) {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === format
    });

    return !!match;
  },

  toggleBlock(editor, format) {
    const isActive = CustomEditor.isBlockActive(editor, format);
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
      match: n => LIST_TYPES.includes(n.type),
      split: true
    });

    Transforms.setNodes(editor, {
      type: isActive ? "paragraph" : isList ? "list-item" : format
    });

    if (!isActive && isList) {
      const block = { type: format, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  }
};

export const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case "code":
      return (
        <pre {...attributes}>
          <code>{children}</code>
        </pre>
      );
      break;
    case "quote right":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "list":
      return <ul {...attributes}>{children}</ul>;
    case "heading":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "list ol":
      return <ol {...attributes}>{children}</ol>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

export const Leaf = ({ attributes, leaf, children }) => {
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

// Define a serializing function that takes a value and returns a string.
export const serialize = value => {
  return (
    value
      // Return the string content of each paragraph in the value's children.
      .map(n => Node.string(n))
      // Join them all with line breaks denoting paragraphs.
      .join("\n")
  );
};

// Define a deserializing function that takes a string and returns a value.
export const deserialize = string => {
  // Return a value array of children derived by splitting the string.
  return string.split("\n").map(line => {
    return {
      children: [{ text: line }]
    };
  });
};
