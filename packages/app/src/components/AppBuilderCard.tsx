import React, { FC } from 'react';

import styled from '@emotion/styled';

import Cover1 from '../assets/covers/2601721286911_.pic.jpg';
import { AppBuilderCardProps } from '../types/appbuilder.type';

const AppBuilderCardContainer = styled.div`
  display: flex;
  border-radius: 17px;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 2px solid var(--choice-card-background-color);
  background-color: var(--choice-card-background-color);
  color: var(--text-color);
  position: relative;
  width: fit-content;
  user-select: none;
  cursor: pointer;
  transition: border 0.2s ease;

  .card-title {
    height: 1.25rem;
    font-size: 1rem;
    font-weight: 700;
  }

  .card-body {
    overflow: hidden;
    border-radius: calc(17px - 0.75rem / 2);
    background-color: var(--text-color);
    width: 158px;
    height: 158px;
  }

  .image {
    display: block;
    width: 100%;
    height: auto;
    transition: transform 0.5s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  .overlay {
    position: absolute;
    top: calc(0.75rem + 0.75rem + 1.25rem);
    bottom: 0.75rem;
    left: 0.75rem;
    right: 0.75rem;
    border-radius: calc(17px - 0.75rem / 2);
    height: inherit;
    width: inherit;
    opacity: 0;
    transition: 0.2s ease;
    background: linear-gradient(
      to top,
      var(--choice-card-img-overlay-background-color-1) 0%,
      var(--choice-card-img-overlay-background-color-2) 50%,
      var(--choice-card-img-overlay-background-color-3) 75%,
      var(--choice-card-img-overlay-background-color-4) 100%
    );
    display: flex;
    padding: 10px;
    box-sizing: border-box;
    user-select: none;
  }

  &:hover {
    border: 2px solid var(--text-color);

    .overlay {
      opacity: 1;
    }
  }

  .overlay .text {
    color: var(--text-color);
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 8; /* Number of lines you want to show */
    -webkit-box-orient: vertical;
  }
`;

export const AppBuilderCard: FC<AppBuilderCardProps> = ({
  cover,
  title,
  description = '',
}) => {
  return (
    <AppBuilderCardContainer>
      <div className="card-title">{title}</div>
      <div className="card-body">
        <img
          src={cover}
          width={158}
          height={158}
          crossOrigin="anonymous"
          className="image"
        />
        <div className="overlay">
          <span className="text">{description}</span>
        </div>
      </div>
    </AppBuilderCardContainer>
  );
};
