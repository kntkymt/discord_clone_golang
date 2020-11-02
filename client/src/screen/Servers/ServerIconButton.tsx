/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React, { FunctionComponent } from 'react';
import { makeStyles, Theme, createStyles, Avatar, Box, Grid, Tooltip } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avator: {
      backgroundColor: "#37393E",
      width: theme.spacing(6),
      height: theme.spacing(6),
      transition: '0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
      '&:hover': {
        backgroundColor: "#7388DA",
        borderRadius: 16
      },
    },
    selectedAvator: {
      backgroundColor: "#7388DA",
      width: theme.spacing(6),
      height: theme.spacing(6),
      borderRadius: 16,
    },
  })
);

const useTooltipStyles = makeStyles((theme: Theme) => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
    fontSize: 16,
    fontWeight: 'bold',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 12
  },
}));

type Props = {
  className?: string;
  selected: boolean;
  src?: string;
  title?: string;
  tooltipTitle: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export const ServerIconButton: FunctionComponent<Props> = (props) => {
  const classes = useStyles();
  const tooltipClasses = useTooltipStyles();

  return (
    <Grid container className={props.className} direction={'row'} alignItems={'center'}>
      <Box css={props.selected ? styles.selectedLine : styles.line}/>
      <Tooltip
        classes={tooltipClasses}
        arrow
        title={props.tooltipTitle}
        placement={'right'}>
        <Avatar
          css={styles.avatar}
          className={props.selected ? classes.selectedAvator : classes.avator}
          variant={props.selected ? 'rounded' : 'circle'}
          src={props.src}
          onClick={props.onClick}>
            {props.title}
        </Avatar>
      </Tooltip>
    </Grid>
  );
};

const styles = {
  selectedLine: css`
    width: 4px;
    height: 40px;
    background-color: #FFFFFF;
    border-radius: 0px 8px 8px 0px;
  `,
  line: css`
    width: 4px;
    height: 20px;
    transition: 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
    &:hover {
      background-color: #FFFFFF;
      border-radius: 0px 8px 8px 0px;
    }
  `,
  avatar: css`
    margin: 4px 12px 4px 8px;
  `
};
