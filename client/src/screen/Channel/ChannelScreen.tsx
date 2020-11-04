/** @jsx jsx */
import { jsx, css} from '@emotion/core';
import React, { FunctionComponent, useState, useEffect } from 'react';
import { MessageList } from './MessageList';
import { Box, Grid, TextField, makeStyles, Theme, createStyles } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { Text } from '../../component/Text';
import { Channel } from '../../model/Channel';
import { useParams } from 'react-router';
import { useMe } from '../../hooks/useMe';
import { useWindowDimensions } from '../../hooks/useWindowDimensions';
import { useGETArray, usePOST } from '../../hooks/api';
import { Message } from '../../model/Message';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      color: "#FFFFFF",
    },
    root: {
      borderStyle: 'hidden',
      borderColor: '#40444C'
    }
  }),
);

type Props = {
  channel: Channel
}

export const ChannelScreen: FunctionComponent<Props> = (props) => {
  const { channelId } = useParams();
  const me = useMe();
  const messageCreater = usePOST<Message>(`/private/channels/${channelId}/messages`);
  const messages = useGETArray<Message>(`/private/channels/${channelId}/messages`);
  const { width, height } = useWindowDimensions();

  const [text, setText] = useState("");

  useEffect(() => {
    messages.load();
  }, []);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const submit = () => {
    if (text.length === 0 || !props.channel) { return; }

    const message: Message = {
      id: 12,
      content: text,
      user: me.item!,
      createTime: new Date("0001-01-01T00:00:00Z"),
      updateTime: new Date("0001-01-01T00:00:00Z")
    };

    messageCreater.send(message)
      .catch(error => console.error(error));

    setText("");
  };

  const classes = useStyles();

  if (!props.channel) {
    return <Box css={styles.root} />;
  }

  return (
    <Grid css={styles.root} container direction={'column'}>
      <Helmet>
        <title>{props.channel.name ? `#${props.channel.name}` : "discord clone"}</title>
      </Helmet>
      <Grid css={styles.header} container item direction={'row'} alignItems={'center'}>
        <Text css={styles.sharp} color={'#909498'} fontSize={24} fontWeight={'600'}>#</Text>
        <Text color={'#FFFFFF'} fontSize={15} fontWeight={'600'}>{props.channel.name}</Text>
      </Grid>
      <MessageList
        css={css`width: 100%; height: ${height - 50 - 80}px;`}
        messages={messages.item ?? []} />
      <Grid css={styles.input} style={{width: width - 240 - 240 - 70 - 32 - 16}} container direction={'row'} alignItems={'center'}>
        <TextField
          css={styles.textField}
          style={{marginLeft: 8, width: width - 240 - 240 - 70 - 44 - 32 - 32}}
          placeholder={'メッセージを送信'}
          variant={'outlined'}
          size={'small'}
          value={text}
          inputProps={{className: classes.input, classes: {root: classes.root}}}
          onChange={onChange}
          onKeyDown={event => event.keyCode === 13 ? submit() : {}} />
      </Grid>
    </Grid>
  );
};

const styles = {
  root: css`
    width: 100%;
    height: 100vh;
    background-color: #35393F;
  `,
  header: css`
    width: 100%;
    height: 50px;
    background-color: #37393E;
    border-bottom: solid medium #2D3034;
    position: top;
  `,
  sharp: css`
    margin-left: 16px;
    margin-right: 6px;
  `,
  content: css`
    width: 100%;
  `,
  input: css`
    margin: 0px 16px;
    padding: 2px 8px;
    border-radius: 8px;
    background-color: #40444C;
  `,
  textField: css`
    border-style: hidden;
    font-weight: '600';
    background-color: #40444C;
  `
};
