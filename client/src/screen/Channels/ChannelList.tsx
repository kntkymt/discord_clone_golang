/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React, { FunctionComponent } from 'react';
import { Grid, List, ListItem, makeStyles, Theme, createStyles } from '@material-ui/core';
import { Text } from '../../component/Text';
import { Channel } from '../../model/Channel';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "#2E3137",
      '&:hover': {
        backgroundColor: "#3A3C43"
      },
    },
    selectedRoot: {
      backgroundColor: "#3A3C43",
      '&:hover': {
        backgroundColor: "#3A3C43"
      },
    },
  })
);

type ItemProps = {
  channel: Channel;
  selected: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const Item: FunctionComponent<ItemProps> = (props) => {
  const classes = useStyles();

  return (
    <ListItem
      classes={{ root: props.selected ? classes.selectedRoot : classes.root }}
      style={{width: 224, marginTop: 2, marginRight: 8, marginBottom: 2, marginLeft: 8, paddingTop: 4, paddingRight: 8, paddingBottom: 4, paddingLeft: 8, borderRadius: 8}}
      button
      onClick={props.onClick}>
      <Grid container direction='row' alignItems={'center'} >
        <Text css={itemStyles.sharp} color={'#909498'} fontSize={22} fontWeight={'600'}>#</Text>
        <Text color={props.selected ? '#FFFFFF' : '#909498'} fontSize={15} fontWeight={'600'}>{props.channel.name}</Text>
      </Grid>
    </ListItem>
  );
};

type Props = {
  className?: string;
  channels: Channel[];
  itemOnClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, channel: Channel) => void;
  itemSelected: (channel: Channel) => boolean;
};

export const ChannelList: FunctionComponent<Props> = (props) => {

  return (
    <List className={props.className} css={styles.root} style={{paddingTop: 0, maxHeight: '90vh', overflow: 'auto'}}>
      {props.channels.map(channel =>
        <Item
          key={channel.id}
          channel={channel}
          selected={props.itemSelected(channel)}
          onClick={(event) => props.itemOnClick(event, channel)}/>
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
  sharp: css`
    margin-right: 6px;
  `,
};
