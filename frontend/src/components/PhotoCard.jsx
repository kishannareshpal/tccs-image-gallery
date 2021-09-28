import React from "react";
import RoundImage from "./RoundImage";

// TODO: proptypes

const PhotoCard = ({ url, onClick, imageThumbnailHeight }) => (
    <RoundImage
        sx={{ cursor: "zoom-in", boxShadow: 1 }}
        onClick={onClick}
        width="100%"
        height={imageThumbnailHeight}
        src={url}
        alt="Photo thumbnail"
    />
);

PhotoCard.defaultProps = {
    imageThumbnailHeight: 226
};

export default PhotoCard;
