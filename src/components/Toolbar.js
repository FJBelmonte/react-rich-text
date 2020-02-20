import React from "react";
import { Menu, Icon } from "semantic-ui-react";

export default function toolbar(props) {
  const { items } = props;
  function onClick(name) {
    props.onClick(name);
  }
  return (
    <Menu>
      {items.map((item, index) => (
        <Menu.Item
          key={index}
          name={item.name}
          active={item.active}
          onClick={() => {
            onClick(item.name);
          }}>
          <Icon name={item.name} size='large' />
        </Menu.Item>
      ))}
    </Menu>
  );
}
