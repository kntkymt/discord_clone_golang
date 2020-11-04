/** @jsx jsx */
import { jsx, css} from '@emotion/core';
import React, { FunctionComponent, useEffect, useState} from 'react';
import { Grid, Box } from '@material-ui/core';
import { ChannelsScreen } from '../Channels/ChannelsScreen';
import { ServerList } from './ServerList';
import { Server } from '../../model/Server';
import { ServerIconButton } from './ServerIconButton';
import { HomeScreen } from '../Home/HomeScreen';
import { Switch, Route, useHistory, useLocation } from 'react-router';
import '../../extensions/arrayExtension';
import { useGETArray } from '../../hooks/api';

export const ServersScreen: FunctionComponent = () => {
  const servers = useGETArray<Server>("/private/me/servers");
  const [selectedItemId, setSelectedItemId] = useState("");
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    servers.load();
  }, []);

  useEffect(() => {
    // 歯車ボタンからhomeに行った場合
    // (子コンポーネントのことを知ってるのは良いのか...?)
    if (location.pathname.split("/").get(1) === "home") {
      setSelectedItemId("home");
    }

  }, [location.pathname]);

  useEffect(() => {
    // ログイン or リロード時に選択サーバーを復帰する
    if (selectedItemId) { return; }

    // usePrams()ではRouteされてるコンポーネントからしかparamを取れないのでlocationを使う
    const serverId = location.pathname.split("/").get(1);

    if (serverId) {
      // URLから復帰時
      setSelectedItemId(serverId);
    } else {
      // どこのサーバーも指定していなかった場合、一番上のサーバーを選択する
      const serverId = servers.item?.first()?.id;
      if (!serverId) { return; }

      setSelectedItemId(String(serverId));
      history.push(`/${serverId}`);
    }
  }, [location.pathname, servers.item]);

  const handleListItemClick = (id: string) => {
      if (!id) { return; }
      setSelectedItemId(id);
      history.push(`/${id}`);
    };

  return (
    <Grid css={styles.root} container item sm direction={'row'}>
      <Box css={styles.servers}>
        <ServerIconButton
          css={styles.homeButton}
          tooltipTitle={'ホーム'}
          selected={selectedItemId === 'home'}
          onClick={(event) =>  handleListItemClick('home')}
        />
        <Box css={styles.line} />
        <ServerList
          servers={servers.item ?? []}
          itemSelected={(server) => String(server.id) === selectedItemId}
          itemOnClick={(event, server) => handleListItemClick(String(server.id))} />
      </Box>
      <Grid item sm>
        <Switch>
          <Route exact path={'/home'} component={HomeScreen}/>
          <Route
            path={'/:serverId'}
            render={() => <ChannelsScreen key={selectedItemId} server={servers.item.filter(server => String(server.id) === selectedItemId).first()!} />}/>
        </Switch>
      </Grid>
    </Grid>
  );
};

const styles = {
  root: css`
    width: 100vw;
    background-color: #2E3137;
  `,
  servers: css`
    height: 100vh;
    width: 72px;
    background-color: #202225;
  `,
  homeButton: css`
    margin: 12px 0px 8px 0px;
  `,
  line: css`
    background-color: #2A2D30;
    height: 2px;
    width: 30px;
    margin: 4px 21px;
  `,
};
