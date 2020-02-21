import React from "react";
import { Menu } from "semantic-ui-react";

export default function toolbar(props) {
  return <Menu>{props.children}</Menu>;
}
