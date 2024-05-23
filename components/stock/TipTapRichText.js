import React, { useState } from "react";
import {
  EditorState,
  ContentState,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import dynamic from "next/dynamic";

const ControlledEditor = ({ setStringifiedDescription, type, data }) => {
  let initialState;
  if (type === "create") {
    initialState = EditorState.createEmpty();
  }

  if (type === "edit") {
    if (data) {
      initialState = EditorState.createWithContent(convertFromRaw(data));
    } else {
      initialState = EditorState.createEmpty();
    }
  }

  const [editorState, setEditorState] = useState(initialState);

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);

    const content = convertToRaw(editorState.getCurrentContent());
    const editedDescription = JSON.stringify(content);
    setStringifiedDescription(editedDescription);
  };

  return (
    <Editor
      editorState={editorState}
      wrapperClassName="demo-wrapper"
      editorClassName="demo-editor"
      onEditorStateChange={onEditorStateChange}
    />
  );
};

export default ControlledEditor;
