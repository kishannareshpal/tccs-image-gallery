import React from "react";
import PropTypes from "prop-types";
import RoundImage from "./RoundImage";

const PhotoCard = ({ url, onClick, thumbnailHeight }) => (
    <RoundImage
        sx={{ cursor: "zoom-in", boxShadow: 1 }}
        onClick={onClick}
        width="100%"
        height={thumbnailHeight}
        src={url}
        alt="Photo thumbnail"
    />
);

PhotoCard.defaultProps = {
    thumbnailHeight: 226,
    onClick: null
};

PhotoCard.propTypes = {
    /**
     * The url of the photo to be displayed
     * [required]
     */
    url: PropTypes.string.isRequired,
    /**
     * Action taken on click of the image. Normally it's used for displaying the original full size image.
     * @default null
     */
    onClick: PropTypes.func,
    /**
     * The height for the thumbnail
     * @default 226
     */
    thumbnailHeight: PropTypes.number
};

export default PhotoCard;
