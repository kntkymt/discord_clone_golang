/** @jsx jsx */
import { jsx, css} from '@emotion/core';
import React, { FunctionComponent } from 'react';
import { Grid, Avatar, IconButton, makeStyles, Tooltip, Theme } from '@material-ui/core';
import { Text } from '../../component/Text';
import { useMe } from '../../hooks/useMe';
import SettingsIcon from '@material-ui/icons/Settings';
import { useHistory } from 'react-router';

const useTooltipStyles = makeStyles((theme: Theme) => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
    fontSize: 14,
    fontWeight: 'bold',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 12
  },
}));

export const MyInformationBox: FunctionComponent = () => {
  const me = useMe();
  const history = useHistory();
  const tooltipClasses = useTooltipStyles();

  const handleSettingIconClick = () => {
    history.push('/home');
  };

  return (
    <Grid css={styles.container} container item alignItems={'center'} direction={'row'}>
      <Avatar css={styles.avatar} style={{width: 32, height: 32}} />
      <Text css={styles.userName} color={'#FFFFFF'} fontWeight={'500'}>{me.item?.name}</Text>
      <Tooltip classes={tooltipClasses} arrow title={'ユーザー設定'} placement={'top'}>
        <IconButton style={{padding: 4, marginLeft: 8}} onClick={handleSettingIconClick}>
          <SettingsIcon style={{color: '#B9BBBE'}} />
        </IconButton>
      </Tooltip>
    </Grid>
  );
};

const styles = {
  container: css`
    background-color: #292B2F;
    height: 50px;
  `,
  avatar: css`
    margin: 4px 8px;
  `,
  userName: css`
    width: 60%;
  `
};
