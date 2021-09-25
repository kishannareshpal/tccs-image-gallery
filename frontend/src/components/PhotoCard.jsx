import React from "react";
import { Button, Stack, Typography, Box, styled } from "@mui/material";
import { Delete } from "@mui/icons-material";

const Img = styled("img")({
    borderRadius: 12,
    objectFit: "cover",
    cursor: "zoom-in"
});

const PhotoCard = ({ url, onClick, imageThumbnailHeight }) => (
    <Img
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
