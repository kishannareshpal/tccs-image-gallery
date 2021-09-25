import React from "react";
import { Stack, Box, Typography, styled } from "@mui/material";
import { Collections } from "@mui/icons-material";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ImgBox = styled(Box)({
    position: "relative",
    cursor: "pointer"
});

/**
 * The image tag, but rounded and with the photo which cover's the container
 */
const Img = styled("img")({
    borderRadius: 12,
    objectFit: "cover"
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
    description,
    imageThumbnailHeight,
    imageThumbnails
    // imageCount
}) => (
    <div>
        <Link to={`/galleries/${galleryId}`}>
            <ImgBox>
                <Img
                    width="100%"
                    height={imageThumbnailHeight}
                    src={`https://source.unsplash.com/random?sig=${title}`}
                    alt="Gallery photo thumbnail"
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
                        to={`/${username}/galleries/${galleryId}`}
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
    description: null,
    imageThumbnailHeight: 186,
    imageThumbnails: []
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
     * Gallery description
     * @default null
     */
    description: PropTypes.string,
    /**
     * Gallery thumbnail image height
     * @default 146
     */
    imageThumbnailHeight: PropTypes.number,
    /**
     * List of image thumbnails srcs. Provide an array of size 3
     */
    imageThumbnails: PropTypes.arrayOf(PropTypes.string)
    /**
     * Number of images included in the gallery.
     * TODO: implement later
     */
    // imageCount: PropTypes.number.isRequired
};

export default GalleryCard;
