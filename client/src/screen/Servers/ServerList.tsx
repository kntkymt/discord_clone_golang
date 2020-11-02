/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React, { FunctionComponent } from 'react';
import { List, ListItem } from '@material-ui/core';
import { Server } from '../../model/Server';
import { ServerIconButton } from './ServerIconButton';

type ItemProps = {
  server: Server;
  selected: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const Item: FunctionComponent<ItemProps> = (props) => {

  return (
    <ListItem
      style={{paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0}}
      button
      onClick={props.onClick}>
      <ServerIconButton
        selected={props.selected}
        title={props.server.name.substr(0, 1).toUpperCase()}
        tooltipTitle={props.server.name}
      />
    </ListItem>
  );
};

type Props = {
  className?: string;
  servers: Server[];
  itemOnClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, server: Server) => void;
  itemSelected: (channel: Server) => boolean;
};

export const ServerList: FunctionComponent<Props> = (props) => {

  return (
    <List className={props.className} css={styles.root} style={{paddingTop: 0, overflow: 'auto'}}>
      {props.servers.map(server =>
        <Item
          key={server.id}
          server={server}
          selected={props.itemSelected(server)}
          onClick={(event) => props.itemOnClick(event, server)}/>
      )}
    </List>
  );
};

const styles = {
  root: css`
    background-color: #202225;
  `
};
