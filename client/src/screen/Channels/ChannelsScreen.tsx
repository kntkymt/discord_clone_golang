/** @jsx jsx */
import { jsx, css} from '@emotion/core';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { ChannelScreen } from '../Channel/ChannelScreen';
import { Grid, Box } from '@material-ui/core';
import { Text } from '../../component/Text';
import { ChannelList } from './ChannelList';
import { Switch, Route, useHistory, useParams, useLocation } from 'react-router';
import { Server } from '../../model/Server';
import '../../extensions/arrayExtension';
import { useWindowDimensions } from '../../hooks/useWindowDimensions';
import { MyInformationBox } from './MyInfomationBox';
import { UserList } from './UserList';

type Props = {
  server: Server
}

export const ChannelsScreen: FunctionComponent<Props> = (props) => {
  const { serverId } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [selectedItemId, setSelectedItemId] = useState("");
  const { height } = useWindowDimensions();

  useEffect(() => {
    // サーバー切り替え or リロードの時に選択チャンネルを復帰する
    if (!props.server || selectedItemId) { return; }

    // usePrams()ではRouteされてるコンポーネントからしかparamを取れないのでlocationを使う
    const channelId = location.pathname.split("/").get(2);

    if (channelId) {
      // URLから復帰時
      setSelectedItemId(channelId);
    } else {
      // どこのチャンネルも指定していなかった場合、一番上のチャンネルを選択する
      const channelId = props.server.channels.first()?.id;
      if (!channelId) { return; }

      setSelectedItemId(String(channelId));
      history.push(`${serverId}/${channelId}`);
    }
  }, [location.pathname, props.server]);

  const handleListItemClick = (id: string) => {
      if (!id) { return; }
      setSelectedItemId(id);
      history.push(`/${serverId}/${id}`);
    };

  // 簡易LoadingView
  if (!props.server) {
    return <Box css={styles.root} />;
  }

  return (
    <Grid css={styles.root} container direction={'row'}>
      <Grid css={styles.root} container item sm direction={'row'}>
        <Box css={styles.side}>
          <Box>
            <Grid css={styles.header}>
              <Text css={styles.serverName} color={'#FFFFFF'} fontSize={16} fontWeight={'700'}>{props.server.name}</Text>
            </Grid>
            <Text css={styles.channelName} color={'#909498'} fontSize={13} fontWeight={'600'}>チャンネル</Text>
            <ChannelList
              css={css`width: 240px; height: ${height - 50 - 31 - 24 - 24 - 24}px;`}
              channels={props.server.channels ?? []}
              itemSelected={(channel) => String(channel.id) === selectedItemId}
              itemOnClick={(event, channel) => handleListItemClick(String(channel.id))} />
          </Box>
          <MyInformationBox />
        </Box>
        <Grid item sm>
          <Switch>
            <Route
              path={`/:serverId/:channelId`}
              render={() => <ChannelScreen key={selectedItemId} channel={props.server.channels.filter(channel => String(channel.id) === selectedItemId).first()!}/>}/>
          </Switch>
        </Grid>
        <Box css={styles.right.users}>
          <Box css={styles.right.header} />
          <Text css={styles.right.userLabel} color={'#909498'} fontSize={13} fontWeight={'600'}>ユーザー</Text>
          <UserList users={props.server.users ?? []} />
        </Box>
      </Grid>
    </Grid>
  );
};

const styles = {
  root: css`
    width: 100vw;
    background-color: #2E3137;
  `,
  header: css`
    width: 100%;
    height: 31px;
    background-color: #2E3137;
    border-bottom: solid medium #25272A;
  `,
  serverName: css`
    margin: 16px;
  `,
  channelName: css`
    margin: 24px 16px 0px 16px;
  `,
  channelList: css`
    width: 240px;
  `,
  side: css`
    width: 240px;
    height: 100%;
  `,
  right: {
    root: css`
      width: 100vw;
      background-color: #2E3137;
    `,
    header: css`
      width: 100%;
      height: 46px;
      background-color: #37393E;
      border-bottom: solid medium #25272A;
      position: top;
    `,
    userLabel: css`
      margin: 24px 16px 0px 16px;
    `,
    users: css`
      width: 240px;
      height: 100%;
    `
  }
};
