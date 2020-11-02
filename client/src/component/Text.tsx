/** @jsx jsx */
import { jsx, css} from '@emotion/core';
import React, { FunctionComponent } from 'react';
import { Box } from '@material-ui/core';

type Props = {
  className?: string;
  color?: string;
  fontWeight?: '100' | '200' | '300' | '400' | '500' | '600' | '700';
  fontSize?: number;
}

export const Text: FunctionComponent<Props> = (props) => {

  const style = css`
    color: ${props.color ?? '#000000'};
    font-weight: ${props.fontWeight ?? '500'};
    font-size: ${props.fontSize ?? 16}px;
  `;

  return <Box className={props.className} css={style}>{props.children}</Box>;
};
