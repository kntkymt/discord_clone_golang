/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import React, { FunctionComponent } from 'react';
import { Grid, Avatar, List, ListItem } from '@material-ui/core';
import { Text } from '../../component/Text';
import { Message } from '../../model/Message';

type ItemProps = {
  message: Message;
};

const Item: FunctionComponent<ItemProps> = (props) => {

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const oneDay = 24 * 60 * 60 * 1000;
    const now = Date.now();

    const diffDay = Math.floor((now - date.getTime()) / oneDay);

    if (diffDay === 0) {
      return dayjs(date).locale('ja').format('今日 hh:mm');
    } else if (diffDay === 1) {
      return dayjs(date).locale('ja').format('昨日 hh:mm');
    } else {
      return dayjs(date).locale('ja').format('YYYY/MM/DD');
    }
  };

  return (
    <ListItem>
      <Grid css={itemStyles.root} container direction='row' >
        <Avatar css={css`margin-right: 16px;`} />
        <Grid style={{width: "90%"}} item>
          <Grid item container direction='row' >
            <Text color={'#FFFFFF'} fontWeight={'500'}>{props.message.user.name}</Text>
            <Text css={itemStyles.date} color={'#6C6F76'} fontSize={12}>{formatDate(props.message.createTime)}</Text>
          </Grid>
          <Text color={'#E6E7E7'} fontWeight={'500'}>{props.message.content}</Text>
        </Grid>
      </Grid>
    </ListItem>
  );
};

type Props = {
  className?: string;
  messages: Message[];
};

export const MessageList: FunctionComponent<Props> = (props) => {

  return (
    <List className={props.className} style={{display: 'flex', flexDirection: 'column-reverse', overflow: 'auto'}}>
      {props.messages.map(message =>
        <Item key={message.id} message={message} />
      )}
    </List>
  );
};

const itemStyles = {
  root: css`
    padding: 4px 0px;
  `,
  date: css`
    margin-left: 6px;
  `,
};
