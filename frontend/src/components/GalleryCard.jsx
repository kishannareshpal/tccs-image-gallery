import React from "react";
import { Stack, Box, Typography, styled } from "@mui/material";
import { Collections } from "@mui/icons-material";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import RoundImage from "./RoundImage";
import DefaultGalleryThumbnailPNG from "../assets/images/default_gallery_thumb.png";

const ImgBox = styled(Box)({
    position: "relative",
    cursor: "pointer"
});

const ImgBoxOverlay = styled(Box)({
    position: "absolute",
    borderRadius: 12,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
        "linear-gradient(180deg, rgba(0, 0, 0, 0.475) 0%, rgba(255,255,255,0) 100%)",
    color: "white"
});

const GalleryCard = ({
    galleryId,
    username,
    title,
    thumbnailHeight,
    thumbnailURL
    // imageCount
}) => (
    <div>
        <Link to={`/galleries/${galleryId}`}>
            <ImgBox>
                <RoundImage
                    width="100%"
                    height={thumbnailHeight}
                    src={thumbnailURL || DefaultGalleryThumbnailPNG}
                    alt={`Gallery ${galleryId} thumbnail`}
                />

                <ImgBoxOverlay>
                    <Stack
                        sx={{ m: 2 }}
                        justifyContent="flex-end"
                        direction="row"
                    >
                        {/* TODO: Implement later */}
                        {/* <Typography variant="subtitle1">
                            {imageCount} Photos
                        </Typography> */}
                        <Collections />
                    </Stack>
                </ImgBoxOverlay>
            </ImgBox>
        </Link>

        <Stack
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
    thumbnailURL: null
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
     * @default 146
     */
    thumbnailHeight: PropTypes.number,
    /**
     * The gallery thumbnail src url
     */
    thumbnailURL: PropTypes.string

    /**
     * Number of images included in the gallery.
     * TODO: implement later
     */
    // imageCount: PropTypes.number.isRequired,
    /**
     * Gallery description
     * TODO: implement later
     * @default null
     */
    //  description: PropTypes.string,
};

export default GalleryCard;
