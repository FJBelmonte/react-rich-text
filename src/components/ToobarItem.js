import React from "react";
import { Menu, Icon } from "semantic-ui-react";

export default function toolbar(props) {
  const { name, active, onClick } = props;
  return (
    <Menu.Item
      name={name}
      active={active}
      onClick={e => {
        e.preventDefault();
        onClick();
      }}>
      <Icon name={name} size='large' />
    </Menu.Item>
  );
}
