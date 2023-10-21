import { useState } from "react";
import "./codeEditor.css";

const CodeEditor = () => {
  const [code, setCode] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [indentation, setIndentation] = useState(0);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(code);
    alert("Code copied to clipboard!");
  };

  const handleSaveClick = () => {
    // if there is some text in textarea then save
    if (code) {
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'textfile.txt';
      a.click();
      URL.revokeObjectURL(url);
      alert("Code saved!");
    } else {
      alert('Codebox is empty. Please enter some code before saving.');
    }
  };

  const handleLockClick = () => {
    setIsLocked(!isLocked);
  };

  const handleCodeChange = (event) => {
    if (!isLocked) {
      setCode(event.target.value);
    }
    // reset indentation when we clear everything
    if (code === "") {
      setIndentation(0);
    }
  };

  const handleParenthesesOpen = (e) => {
    // increase indentation and add indents when '{' is pressed
    if (e.key === "{") {
      const cursorPosition = e.target.selectionStart;
      const updatedCode = `${code.slice(0, cursorPosition)}\n${" ".repeat(
        indentation + 2
      )}${code.slice(cursorPosition)}`;
      setIndentation(indentation + 2);
      setCode(updatedCode);
      e.target.setSelectionRange(
        cursorPosition + 3 + indentation,
        cursorPosition + 3 + indentation
      );
    }
  };

  const handleParenthesesClose = (e) => {
    if (e.key === "}") {
      e.preventDefault();
      const cursorPosition = e.target.selectionStart;
      if (code[cursorPosition] === "}" || cursorPosition === 0) return;
      const updatedCode = `${code.slice(0, cursorPosition)}\n${" ".repeat(
        indentation - 2
      )}${code.slice(cursorPosition)}}`;
      setIndentation(Math.max(0, indentation - 2));
      setCode(updatedCode);
      e.target.setSelectionRange(cursorPosition + 2, cursorPosition + 2);
    }
  };

  return (
    <div className="code-editor">
      <textarea
        id="code-editor-textarea"
        className="code-textarea"
        value={code}
        onChange={handleCodeChange}
        onKeyUp={handleParenthesesOpen}
        onKeyDown={handleParenthesesClose}
        readOnly={isLocked}
        placeholder="Start writing code..."
        autoFocus
      />
      <div className="code-toolbar">
        <button
          id="copy-button"
          className="btn btn__green"
          onClick={handleLockClick}
        >
          {isLocked ? "Unlock" : "Lock"}
        </button>
        <button className="btn btn__aqua" onClick={handleSaveClick}>
          Save
        </button>
        <button className="btn btn__violet" onClick={handleCopyClick}>
          Copy
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;
