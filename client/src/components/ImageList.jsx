import React from 'react';
import styled, { keyframes } from 'styled-components';
import ImageEntry from './ImageEntry.jsx';
import GalleryImageEntry from './GalleryImageEntry.jsx';

const SlideIn = keyframes`
0% {
  height: 0%;
}

100% {
  height: 10%;
}
`;

const ImagesList = styled.div`
  display: flex;
  margin-right: 35px;
  text-align: center;
`;

const MainImage = styled.img`
  height: 500px;
  width: 500px;
  z-index: 5;
  border: 1px solid rgb(102, 102, 102);
`;

const MainEntryWrapper = styled.div`
  position: relative;
  padding-right: 1px;
  margin-right: 20px;
`;

const MagnifiedDiv = styled.figure`
  height: 750px;
  width: 750px;
  display: block;
  position: absolute;
  z-index:4;
  background-repeat: no-repeat;
  border:none;
  transform: translate(526px, -16px);
`;

const Inner = styled.div`
  height: 130px;
  width: 150px;
  position: absolute;
  padding-top: 20px;
  top: 50%;
  left: 50%;
  -moz-transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  border: 1px solid black;
  background-color:#fff;
  opacity: .7;
  font-family: "Helvetica neue",Helvetica,Verdana,Sans-serif;
  font-size: 1.1em;
`;

const ZoomSelector = styled.div`
  height: 250px;
  width: 250px;
  top: 187.5px;
  left: 187.5px;
  position: absolute;
  background-color: rgba(0,0,0,1);
  border: 1px solid black;
`;

const MainImageWrapper = styled.div`
  position: relative;
`;

const GalleryEntryWrapper = styled.div`
  width: 100%;
  padding: 1%;
  z-index: 3;
  position: absolute;
  left: 50%;
  overflow: hidden;
  background-color: rgb(248,248,248,.95);
  -moz-transform: translate(-50%, -90%);
  -webkit-transform: translate(-50%, -90%);
  transform: translate(-50%, -90%);
  animation: ${SlideIn} linear .3s;
`;

const GalleryMainImage = styled.img`
  width: 75vw;
  height: 90vh;
  padding-top: 5vh;
  padding-bottom: 5vh;
`;

const ImageListGallery = styled.div`
  height: 100%;
  width: 100%;
  z-index: 2;
  position: fixed;
  overflow: hidden;
  top: 0;
  left: 0;
  text-align: center;
  background-color: #000;
`;
// zoom and magnification utilities
const halfZoomHeight = 125;
const halfZoomWidth = 125;
const halfZoomHeightPercent = 25;
const halfZoomWidthPercent = 25;
const adjustedPercentXEnd = 100 - halfZoomWidthPercent;
const adjustedPercentYEnd = 100 - halfZoomHeightPercent;
const mainImageWidth = 500;
const mainImageHeight = 500;
const halfMainImageWidth = 250;
const halfMainImageHeight = 250;
const adjustedXEnd = mainImageWidth - halfZoomWidth;
const adjustedYEnd = mainImageHeight - halfZoomHeight;

class ImageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previousImage: '',
      selectedImage: '',
      zoom: false,
      magnifyImage: null,
      galleryState: false,
      xFlat: 0,
      yFlat: 0,
      xPercent: '',
      yPercent: '',
      yRatio: null,
      backgroundPosition: '50% 50%',
    };
    this.onHover = this.onHover.bind(this);
    this.onExit = this.onExit.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onGallerySelect = this.onGallerySelect.bind(this);
    this.onGalleryMovePointer = this.onGalleryMovePointer.bind(this);
    this.selectImageOnLoad = this.selectImageOnLoad.bind(this);
    this.magnifyImage = this.magnifyImage.bind(this);
    this.mainClick = this.mainClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.onMovePointer = this.onMovePointer.bind(this);
    this.onZoom = this.onZoom.bind(this);
    this.onZoomOut = this.onZoomOut.bind(this);
  }

  componentDidMount() {
    this.selectImageOnLoad();
    document.addEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress(e) {
    document.body.style.overflow = 'visible';
    if (e.keyCode === 27) {
      this.setState({
        galleryState: false,
        zoom: false,
      });
    }
  }

  selectImageOnLoad() {
    this.setState({
      selectedImage: this.props.images[0],
      previousImage: this.props.images[0],
    });
  }

  onHover(e) {
    this.setState({
      previousImage: this.state.selectedImage,
      selectedImage: e.target.src,
    });
  }

  onExit() {
    this.setState({
      selectedImage: this.state.previousImage,
    });
  }

  onSelect(e) {
    this.setState({
      previousImage: e.target.src,
      magnifyImage: e.target.src,
    });
  }

  onGallerySelect(e) {
    this.setState({
      previousImage: e.target.src,
      magnifyImage: e.target.src,
      selectedImage: e.target.src,
    });
  }

  magnifyImage(e) {
    this.setState({
      magnifyImage: e.target.src,
    });
  }

  onZoom() {
    this.setState({
      zoom: true,
    });
  }

  onZoomOut() {
    this.setState({
      zoom: false,
      x: null,
      y: null,
      magnifyImage: null,
    });
  }

  mainClick() {
    document.body.style.overflow = 'hidden';
    this.setState({
      galleryState: true,
    });
  }

  onGalleryMovePointer(e) {
    const height = window.innerHeight;
    const YLocation = e.clientY;
    const screenTraversed = YLocation / height;
    this.setState({
      yRatio: screenTraversed,
    });
  }

  mapXFlat(xOffset) {
    const adjustedOffsetX = xOffset - halfZoomWidth;
    if (xOffset >= halfZoomWidth && xOffset <= adjustedXEnd) {
      return adjustedOffsetX;
    }
    if (xOffset < halfZoomWidth) {
      return 0;
    }
    if (xOffset > adjustedXEnd) {
      return halfMainImageWidth;
    }
  }

  mapYFlat(yOffset) {
    const adjustedOffsetY = yOffset - halfZoomHeight;
    if (yOffset >= halfZoomHeight && yOffset <= adjustedYEnd) {
      return adjustedOffsetY;
    }
    if (yOffset > adjustedYEnd) {
      return halfMainImageHeight;
    }
    if (yOffset < adjustedYEnd) {
      return 0;
    }
  }

  mapYMagnification(percentY) {
    const adjustedPercentY = (percentY - halfZoomHeightPercent) / 0.5;
    if (percentY >= halfZoomHeightPercent && percentY <= adjustedPercentYEnd) {
      return adjustedPercentY;
    }
    if (percentY < halfZoomHeightPercent) {
      return 0;
    }
    if (percentY > adjustedPercentYEnd) {
      return 100;
    }
  }

  mapXMagnification(percentX) {
    const adjustedPercentX = (percentX - halfZoomWidthPercent) / 0.5;
    if (percentX >= halfZoomWidthPercent && percentX <= adjustedPercentXEnd) {
      return adjustedPercentX;
    }
    if (percentX < halfZoomWidthPercent) {
      return 0;
    }
    if (percentX > adjustedPercentXEnd) {
      return 100;
    }
  }

  onMovePointer(e) {
    const rect = e.target.getBoundingClientRect();
    const xOffset = (e.clientX - rect.left);
    const yOffset = (e.clientY - rect.top);
    // adjust for percent / 500 * 100
    const percentX = xOffset / 5;
    const percentY = yOffset / 5;
    this.setState({
      xFlat: this.mapXFlat(xOffset),
      yFlat: this.mapYFlat(yOffset),
      xPercent: `${this.mapXMagnification(percentX)}%`,
      yPercent: `${this.mapYMagnification(percentY)}%`,
      backgroundPosition: `${this.state.xPercent} ${this.state.yPercent}`,
    });
  }

  render() {
    // Main- magnifiy Image state
    if (this.state.galleryState === false && this.state.magnifyImage !== null && this.state.zoom === true) {
      return (
        <ImagesList>
          <MainEntryWrapper>
            {this.props.images.map(image => (
              <ImageEntry
                image={image}
                onHover={this.onHover}
                onExit={this.onExit}
                onSelect={this.onSelect}
                state={this.state}
              />
            ))}
          </MainEntryWrapper>
          <MainImageWrapper
            src={this.state.selectedImage}
            onClick={this.mainClick}
            onMouseMove={this.onMovePointer}
            onMouseOut={this.onZoomOut}
          >
            <ZoomSelector style={{ left: this.state.xFlat, top: this.state.yFlat }} />
            <MainImage src={this.state.selectedImage} style={{ opacity: '.8' }} />
          </MainImageWrapper>
          <MagnifiedDiv
            style={{ backgroundImage: `url(${this.state.magnifyImage})`, backgroundPosition: this.state.backgroundPosition }}
          />
        </ImagesList>
      );
    }
    // Main- magnification call to action state
    if (this.state.galleryState === false && this.state.magnifyImage !== null) {
      return (
        <ImagesList>
          <MainEntryWrapper>
            {this.props.images.map(image => <ImageEntry image={image} onHover={this.onHover} onExit={this.onExit} onSelect={this.onSelect} state={this.state} />)}
          </MainEntryWrapper>
          <MainImageWrapper
            src={this.state.selectedImage}
            onClick={this.mainClick}
            onMouseMove={this.onMovePointer}
          >
            <MainImage src={this.state.selectedImage} />
            <Inner onMouseEnter={this.onZoom}>
              <p>
                Mouse over to Zoom
                <br />
                -
                <br />
                Click to enlarge
              </p>
            </Inner>
          </MainImageWrapper>
        </ImagesList>
      );
    }
    // Main - base state
    if (this.state.galleryState === false) {
      return (
        <ImagesList>
          <MainEntryWrapper>
            {this.props.images.map(image => <ImageEntry image={image} onHover={this.onHover} onExit={this.onExit} onSelect={this.onSelect} state={this.state} />)}
          </MainEntryWrapper>
          <MainImageWrapper>
            <MainImage
              src={this.state.selectedImage}
              onMouseEnter={this.magnifyImage}
              onClick={this.mainClick}
              onMouseMove={this.onMovePointer}
              onMouseOut={this.onZoomOut}
            />
          </MainImageWrapper>
        </ImagesList>
      );
    }
    // Gallery - with underbar
    if (this.state.galleryState === true && this.state.yRatio > 0.5) {
      return (
        <ImageListGallery
          onMouseMove={this.onGalleryMovePointer}
        >
          <GalleryMainImage
            src={this.state.selectedImage}
          />
          <GalleryEntryWrapper>
            {this.props.images.map(image => (
              <GalleryImageEntry
                image={image}
                onHover={this.onHover}
                onGallerySelect={this.onGallerySelect}
                onExit={this.onExit}
                onSelect={this.onSelect}
                state={this.state}
              />
            ))}
          </GalleryEntryWrapper>
        </ImageListGallery>
      );
    }
    // Gallery - base state
    if (this.state.galleryState === true) {
      return (
        <ImageListGallery
          onMouseMove={this.onGalleryMovePointer}
        >
          <GalleryMainImage
            src={this.state.selectedImage}
          />
          <div />
        </ImageListGallery>
      );
    }
  }
}

export default ImageList;
