/** @jsx jsx */
import { jsx, css} from '@emotion/core';
import React, { FunctionComponent } from 'react';
import { Grid, Button, Box, createStyles, makeStyles, Theme, Modal, Fade, Backdrop } from '@material-ui/core';
import { Text } from '../component/Text';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
);

type ContentProps = {
  onCancel: () => void;
  onDone: () => void;
}

const Content: FunctionComponent<ContentProps> = (props) => {

  return (
    <Box css={styles.root}>
      <Grid css={styles.content} container direction={'column'} spacing={2}>
        <Grid item>
         <Text color={'#FFFFFF'} fontSize={18} fontWeight={'600'}>ログアウト</Text>
        </Grid>
        <Grid item>
          <Text color={'#FFFFFF'} fontSize={16} fontWeight={'600'}>本当にログアウトしますか？</Text>
        </Grid>
      </Grid>
      <Box css={styles.buttons}>
        <Grid style={{width: '100%'}} container direction={'row'} alignItems={'center'} justify={'flex-end'} spacing={4}>
          <Grid item>
            <Button
              style={{color: '#FFFFFF'}}
              onClick={() => props.onCancel()}>
              キャンセル
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{backgroundColor: "#FF453A", fontWeight: 'bold'}}
              variant="contained"
              color="secondary"
              onClick={() => props.onDone()}>
              ログアウト
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

type Props = {
  open: boolean;
  onCancel: () => void;
  onDone: () => void;
}

export const AlertModal: FunctionComponent<Props> = (props) => {

  const classes = useStyles();

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={props.open}
      onClose={props.onCancel}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}>
      <Fade in={props.open}>
        <Content
          onCancel={props.onCancel}
          onDone={props.onDone}/>
      </Fade>
    </Modal>
  );
};

const styles = {
  root: css`
    outline: none;
    width: 440px;
    background-color: #37393E;
    border-radius: 8px;
  `,
  content: css`
    padding: 16px;
  `,
  buttons: css`
    border-radius: 0px 0px 8px 8px;
    margin-top: 48px;
    width: 100%;
    height: 70px;
    background-color: #2E3137;
  `,
};
