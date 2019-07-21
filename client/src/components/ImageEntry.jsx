import React from 'react';
import styled from 'styled-components';

const MainEntryContainer = styled.div`
`;

const MainEntry = styled.img`
  width:41px;
  height:41px;
  margin-bottom:5px;
  border: 1px solid #ccc;
  &:hover {
    border: 1px solid #0654ba;
  }
`;

const MainSelected = styled.img`
  height: 39px;
  width: 39px;
  margin-bottom:5px;
  border: solid 2px #0654ba;
`;


const ImageEntry = ({
  image, onHover, onExit, onSelect, state,
}) => {
  if (image === state.previousImage) {
    return (
      <MainEntryContainer>
        <MainSelected
          src={image}
          onMouseEnter={onHover}
          onMouseLeave={onExit}
          onClick={onSelect}
        />
      </MainEntryContainer>
    );
  }
  else {
    return (
      <MainEntryContainer>
        <MainEntry
          src={image}
          onMouseEnter={onHover}
          onMouseLeave={onExit}
          onClick={onSelect}
        />
      </MainEntryContainer>
    );
  }
};

export default ImageEntry;
