import React from "react";
import { Container } from "semantic-ui-react";
import TextEditor from "components/TextEditor";

export default function App() {
  return (
    <div>
      <Container>
        <TextEditor />
      </Container>
    </div>
  );
}

const styles = {
  container: { backgroundColor: "#000" }
};
