/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React, { FunctionComponent } from 'react';
import { Grid, Avatar, List, ListItem } from '@material-ui/core';
import { Text } from '../../component/Text';
import { User } from '../../model/User';

type ItemProps = {
  user: User;
};

const Item: FunctionComponent<ItemProps> = (props) => {

  return (
    <ListItem style={{paddingTop: 0, marginBottom: 4}}>
      <Grid css={itemStyles.root} container direction='row' alignItems={'center'} >
        <Avatar css={css`margin-right: 12px;`} style={{width: 32, height: 32}} />
        <Text color={'#909498'} fontSize={15} fontWeight={'600'}>{props.user.name}</Text>
      </Grid>
    </ListItem>
  );
};

type Props = {
  className?: string;
  users: User[];
};

export const UserList: FunctionComponent<Props> = (props) => {

  return (
    <List className={props.className} css={styles.root} style={{paddingTop: 0, maxHeight: '80vh', overflow: 'auto'}}>
      {props.users.map(user =>
        <Item key={user.id} user={user} />
      )}
    </List>
  );
};

const styles = {
  root: css`
    background-color: #2E3137;
  `
};

const itemStyles = {
  root: css`
    width: 100%;
  `
};
