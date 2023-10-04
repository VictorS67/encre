import { css } from '@emotion/react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Textarea from '@mui/joy/Textarea';
import clsx from 'clsx';
import React, { FC, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { userInputGuesserModalState } from '../state/userInput';

const styles = css`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  z-index: 0;
`;

export const AppGuesser: FC = () => {
  const [userInput, setUserInput] = useState('');
  const setUserInputResult = useSetRecoilState(userInputGuesserModalState);

  const handleInput = (e: any) => {
    setUserInput(e.target.value);
  };

  const handleClick = (e: any) => {
    if (userInput.length > 0) setUserInputResult(userInput);
  };

  return (
    <div css={styles}>
      <span>What would you like to create?</span>
      <Textarea
        placeholder="Type something here…"
        onChange={handleInput}
        minRows={3}
        endDecorator={
          <Box
            className="guess-box-footer"
            sx={{
              display: 'flex',
              gap: 'var(--Textarea-paddingBlock)',
              pt: 'var(--Textarea-paddingBlock)',
              borderTop: '1px solid',
              borderColor: 'divider',
              flex: 'auto',
            }}
          >
            <Button sx={{ ml: 'auto' }} onClick={handleClick}>
              Send
            </Button>
          </Box>
        }
        sx={{
          width: 300,
          pl: '10px',
        }}
      />
    </div>
  );
};
