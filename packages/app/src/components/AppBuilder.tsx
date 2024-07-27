import React, { FC } from 'react';

import styled from '@emotion/styled';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

import Cover1 from '../assets/covers/2601721286911_.pic.jpg';
import Cover2 from '../assets/covers/2611721286921_.pic.jpg';
import Cover3 from '../assets/covers/2621721286928_.pic.jpg';
import Cover4 from '../assets/covers/2631721286934_.pic.jpg';
import Cover5 from '../assets/covers/2641721286942_.pic.jpg';

import { AppBuilderActionButton } from './AppBuilderActionButton';
import { AppBuilderCard } from './AppBuilderCard';
import { Icon } from './Icon';

const AppBuilderContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: var(--canvas-background-color);
  border-left: 1px solid var(--text-disabled-color);
`;

const SearchContainer = styled.div`
  margin-top: var(--header-height);
  width: 100%;
  height: 40vh;

  .search-panel-container {
    font-size: 1rem;
    padding: 0 1.75rem;
    margin: auto;
    height: 100%;
    z-index: 2;
  }

  .search-panel {
    display: flex;
    flex: 1;
    margin-left: auto;
    margin-right: auto;
    gap: 1rem;
    font-size: 1rem;
    height: 100%;
  }

  .search-box-container {
    position: relative;
    display: flex;
    height: 100%;
    max-width: 100%;
    flex: 1;
    flex-direction: column;
    justify-content: flex-end;
  }

  .search-box-wrapper {
    display: flex;
    width: 100%;
    align-items: center;
  }

  .search-box {
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 0.375rem;
    border-radius: 26px;
    padding: 0.375rem;
    background-color: var(--node-foreground-color);
    border: 2px solid var(--text-color);
    transition: color 0.3s ease;
  }

  .search-flex {
    display: flex;
    align-items: flex-end;
    gap: 0.375rem;
  }

  .search-textarea-wrapper {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
  }

  @media (min-width: 768px) {
    padding-top: 0;
    border-color: transparent;
    width: calc(100% - 0.5rem);

    .search-panel-container {
      padding: 0 1.25rem;
    }

    .search-panel {
      max-width: 48rem;
      gap: 1.25rem;
    }

    .search-flex {
      gap: 0.5rem;
    }
  }

  @media (min-width: 1024px) {
    .search-panel-container {
      padding: 0 1.25rem;
    }

    .search-panel {
      max-width: 40rem;
      gap: 1.5rem;
    }
  }

  @media (min-width: 1280px) {
    .search-panel-container {
      padding: 0 1.5rem;
    }

    .search-panel {
      max-width: 48rem;
    }
  }

  @media (prefers-color-scheme: dark) {
    border-color: var(--text-color);

    @media (min-width: 768px) {
      border-color: transparent;
    }
  }
`;

const UserActionContainer = styled.div`
  width: 100%;
  height: calc(100vh - 40vh - var(--header-height));

  .flex-row {
    display: flex;
    flex: 1;
    margin-left: auto;
    margin-right: auto;
    gap: 1rem;
    font-size: 1rem;
    height: 100%;
    padding-bottom: 2rem;
    overflow-x: scroll;
  }

  @media (min-width: 768px) {
    .flex-row {
      max-width: 48rem;
      gap: 1.25rem;
    }
  }

  @media (min-width: 1024px) {
    .flex-row {
      max-width: 40rem;
      gap: 1.5rem;
    }
  }

  @media (min-width: 1280px) {
    .flex-row {
      max-width: 48rem;
    }
  }
`;

const SearchBox = styled.textarea`
  margin: 0;
  resize: none;
  background-color: transparent;
  padding-left: 0;
  padding-right: 0;
  color: var(--text-color);
  max-height: 25vh;
  height: 100%;
  padding: 1rem 0.75rem;
  width: 100%;
  border: none;
  outline: none;
  font-size: 1rem;

  @media (min-height: 208rem) {
    max-height: 52rem;
  }
`;

const SendButton = styled.button`
  margin-bottom: 0.25rem;
  margin-inline-end: 0.25rem;
  display: flex;
  height: 2.5rem;
  width: 2.5rem;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--text-color);
  border-radius: 9999px;
  background-color: var(--text-color);
  color: var(--node-foreground-color);
  transition:
    color 0.1s ease,
    background-color 0.1s ease;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }

  &:focus-visible {
    outline: none;
  }

  &:disabled {
    border: 2px solid var(--text-disabled-color);
    background-color: var(--text-disabled-color);
    color: var(--node-background-color);
    opacity: 1;
  }
`;

const QuoteArea = styled.div`
  display: flex;
  flex-direction: column;
  border-color: var(--text-color);
  border-style: solid;
  border-width: 0;
  overflow: hidden;
  border-radius: 20px 20px 0 0;
  background-color: var(--node-background-color);
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;

  & > * + * {
    border-top-width: 1px;
  }

  .quote-row {
    display: flex;
    align-items: flex-start;
    padding: 0.625rem 0.375rem 0.625rem 0.75rem;
    gap: 1rem;
    font-size: 0.875rem;
    color: var(--text-color);
  }

  .quote-text {
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    padding-top: 0.125rem;
    padding-bottom: 0.125rem;
  }
`;

const SearchNote = styled.div`
  position: relative;
  padding: 0.5rem 0.5rem;
  text-align: center;
  font-size: 0.75rem;
  color: var(--text-color);
`;

const SearchPrompt = styled.div`
  position: absolute;
  top: var(--header-height);
  left: 0;
  height: 19vh;
  width: 100%;
  padding: 0.5rem 0.5rem;
  text-align: center;
  font-size: 1.5rem;
  color: var(--text-color);

  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1;
`;

const CardContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 0 1.25rem;
  margin-top: 4rem;
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 0 1.25rem;
  margin-top: 1.25rem;
`;

export const AppBuilder: FC = () => {
  // TODO: remove this
  const dummyDescription =
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque \
  laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi \
  architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas \
  sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione \
  voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit \
  amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut \
  labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis \
  nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea \
  commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit \
  esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas \
  nulla pariatur?';

  return (
    <AppBuilderContainer>
      <SearchContainer>
        <SearchPrompt>
          <span>What would you like to build today?</span>
        </SearchPrompt>
        <div className="search-panel-container">
          <div className="search-panel">
            <div className="search-box-container">
              <div className="search-box-wrapper">
                <div className="search-box">
                  {/* <QuoteArea>
                  <div className="quote-row">
                    <span className="quote-text">
                      Something here
                    </span>
                  </div>
                </QuoteArea> */}
                  <div className="search-flex">
                    <div className="search-textarea-wrapper">
                      <SearchBox
                        tabIndex={0}
                        dir="auto"
                        rows={1}
                        placeholder="Message ChatGPT"
                        style={{
                          height: '40px',
                          overflowY: 'hidden',
                        }}
                      />
                    </div>
                    <SendButton>
                      <Icon
                        icon={AutoAwesomeRoundedIcon}
                        width={'1.35rem'}
                        height={'1.35rem'}
                        fontSize={'1.35rem'}
                      />
                    </SendButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <SearchNote>
            <span>ChatGPT can make mistakes.</span>
          </SearchNote>
        </div>
      </SearchContainer>
      <UserActionContainer>
        <CardContainer>
          <div className="flex-row">
            <AppBuilderCard
              cover={Cover1}
              title={'Chat App'}
              description={dummyDescription}
            />
            <AppBuilderCard
              cover={Cover2}
              title={'Paragraphs'}
              description={dummyDescription}
            />
            <AppBuilderCard
              cover={Cover3}
              title={'Translation'}
              description={dummyDescription}
            />
            <AppBuilderCard
              cover={Cover4}
              title={'Summary'}
              description={dummyDescription}
            />
            <AppBuilderCard
              cover={Cover5}
              title={'Your Own App'}
              description={dummyDescription}
            />
          </div>
        </CardContainer>
        <ActionContainer>
          <div className="flex-row" style={{ justifyContent: 'flex-end' }}>
            <AppBuilderActionButton name={'More Apps'} />
            {/* <AppBuilderActionButton name={'Re-ask'} />
          <AppBuilderActionButton name={'Proceed'} /> */}
          </div>
        </ActionContainer>
      </UserActionContainer>
    </AppBuilderContainer>
  );
};
