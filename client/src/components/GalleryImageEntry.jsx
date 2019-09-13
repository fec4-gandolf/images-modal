import React from 'react';
import styled from 'styled-components';

const GalleryContainer = styled.div`
  display: inline-block;
  padding-top: 4px;
  margin: 0px 4px;
`;

const GalleryImageEntry = styled.img`
  height: 72px;
  width: 72px;
  border: solid 1px #ccc;
  border-radius:3px;
  &:hover {
    border: solid 1px #000;
  }
`;

const GallerySelected = styled.img`
  height: 70px;
  width: 70px;
  border: solid 2px #000;
  border-radius:3px;
`;

const ImageEntry = ({
  image, onHover, onExit, onGallerySelect, state,
}) => {
  if (image === state.previousImage) {
    return (
      <GalleryContainer>
        <GallerySelected
          src={image}
          onMouseLeave={onExit}
          onClick={onGallerySelect}
        />
      </GalleryContainer>
    );
  }

  return (
    <GalleryContainer>
      <GalleryImageEntry
        src={image}
        onMouseLeave={onExit}
        onClick={onGallerySelect}
      />
    </GalleryContainer>
  );
};

export default ImageEntry;
