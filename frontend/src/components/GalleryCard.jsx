import React from "react";
import { Stack, Box, Typography, styled } from "@mui/material";
import { Collections } from "@mui/icons-material";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import pluralize from "pluralize";
import RoundImage from "./RoundImage";
import DefaultGalleryThumbnailPNG from "../assets/images/default_gallery_thumb.png";

const ImgBox = styled(Box)({
    position: "relative",
    cursor: "pointer"
});

const ImgBoxOverlay = styled(Box)({
    position: "absolute",
    display: "inline-block",
    top: 12,
    pointerEvents: "none",
    left: 12,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.63)",
    color: "white"
});

const GalleryCard = ({
    galleryId,
    username,
    title,
    thumbnailHeight,
    thumbnailURL,
    photosCount
}) => (
    <div>
        <Link to={`/galleries/${galleryId}`}>
            <ImgBox sx={{ height: thumbnailHeight }}>
                <RoundImage
                    sx={{
                        border: "2px solid #E8EDF2",
                        "&:hover": {
                            transitionDuration: "350ms",
                            borderColor: "#000"
                        }
                    }}
                    width="100%"
                    height="100%"
                    src={thumbnailURL || DefaultGalleryThumbnailPNG}
                    alt={`Gallery ${galleryId} thumbnail`}
                />

                <ImgBoxOverlay>
                    <Stack sx={{ p: 1 }} spacing={1} direction="row">
                        <Collections />
                        <Typography variant="subtitle2">
                            {photosCount} {pluralize("photo", photosCount)}
                        </Typography>
                    </Stack>
                </ImgBoxOverlay>
            </ImgBox>
        </Link>

        <Stack
            mt={1}
            direction="row"
            alignItems="center"
            overflow="hidden"
            textOverflow="ellipsis"
        >
            <Box sx={{ ml: 2 }}>
                <div>
                    <Typography
                        to={`/galleries/${galleryId}`}
                        color="#000"
                        lineHeight="unset"
                        sx={{
                            textDecoration: "none",
                            "&:hover": {
                                textDecoration: "underline"
                            }
                        }}
                        fontWeight={600}
                        component={Link}
                        variant="subtitle1"
                    >
                        {title}
                    </Typography>
                </div>

                <div>
                    <Typography
                        to={`/${username}`}
                        color="#000"
                        sx={{
                            textDecoration: "none",
                            "&:hover": {
                                textDecoration: "underline"
                            }
                        }}
                        fontWeight={400}
                        component={Link}
                        variant="subtitle2"
                    >
                        @{username}
                    </Typography>
                </div>
            </Box>
        </Stack>
    </div>
);

GalleryCard.defaultProps = {
    thumbnailHeight: 186,
    thumbnailURL: null,
    photosCount: 0
};

GalleryCard.propTypes = {
    /**
     * Gallery ID
     */
    galleryId: PropTypes.number.isRequired,
    /**
     * Gallery owner's username.
     */
    username: PropTypes.string.isRequired,
    /**
     * Gallery title
     */
    title: PropTypes.string.isRequired,
    /**
     * Gallery thumbnail image height
     * @default 186
     */
    thumbnailHeight: PropTypes.number,
    /**
     * The gallery thumbnail src url
     */
    thumbnailURL: PropTypes.string,

    /**
     * Number of photos included in the gallery.
     */
    photosCount: PropTypes.number

    /**
     * Gallery description
     * TODO: implement later
     * @default null
     */
    //  description: PropTypes.string,
};

export default GalleryCard;
