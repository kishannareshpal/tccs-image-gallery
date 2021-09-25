import React from "react";
import {
    Paper as MuiPaper,
    Stack,
    Box,
    Typography,
    darken,
    styled
} from "@mui/material";
import { Collections } from "@mui/icons-material";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * A rounded paper behind each {@link GalleryCard}
 */
const Paper = styled(MuiPaper)(({ theme }) => ({
    padding: theme.spacing(2),
    border: "1px solid #CFD9DE",
    borderRadius: 12,
    "&:hover": {
        backgroundColor: darken("#fff", 0.03),
        cursor: "pointer"
    }
}));

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

const ImgBoxOverlay = styled(Box)(({ theme }) => ({
    position: "absolute",
    borderRadius: 12,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    transitionDuration: "234ms",
    background:
        "linear-gradient(180deg, rgba(0, 0, 0, 0.475) 0%, rgba(255,255,255,0) 100%)",
    color: "white"
}));

const GalleryCard = ({
    galleryId,
    username,
    title,
    description,
    imageThumbnailHeight,
    imageThumbnails,
    imageCount
}) => (
    <div>
        <Link to={`/${username}/galleries/${galleryId}`}>
            <ImgBox>
                <Img
                    width="100%"
                    height={imageThumbnailHeight}
                    src={`https://source.unsplash.com/random?sig=${title}`}
                    alt="Gallery image thumbnail"
                />

                <ImgBoxOverlay>
                    <Stack
                        sx={{ m: 2 }}
                        justifyContent="space-between"
                        direction="row"
                    >
                        <Typography variant="subtitle1">1 Photos</Typography>
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
                        sx={{
                            color: "#000",
                            textDecoration: "none",
                            lineHeight: "unset",
                            fontWeight: 600
                        }}
                        component={Link}
                        variant="subtitle1"
                    >
                        {title}
                    </Typography>
                </div>

                <div>
                    <Typography
                        to={`/${username}`}
                        sx={{
                            color: "#000",
                            textDecoration: "none",
                            fontWeight: 400
                        }}
                        component={Link}
                        variant="subtitle2"
                    >
                        @{username}
                    </Typography>
                </div>
            </Box>
        </Stack>
    </div>

    // <Paper elevation={0}>
    //     {imageThumbnails && (
    //         <Grid mb={2} container columnSpacing={1.5}>
    //             {imageThumbnails.map(thumbnailSrc => (
    //                 <Grid key={thumbnailSrc} item xs>
    //                     <Img
    //                         width="100%"
    //                         height={imageThumbnailHeight}
    //                         src={thumbnailSrc}
    //                         alt="Gallery image thumbnail"
    //                     />
    //                 </Grid>
    //             ))}

    //             {imageCount > 3 && (
    //                 <Grid item xs>
    //                     <Box
    //                         display="flex"
    //                         height={imageThumbnailHeight}
    //                         alignItems="center"
    //                         justifyContent="center"
    //                         borderRadius="12px"
    //                         title={`Gallery contains ${imageCount} image(s)`}
    //                     >
    //                         <Typography fontWeight={800}>
    //                             +{imageCount - 3}
    //                         </Typography>
    //                     </Box>
    //                 </Grid>
    //             )}
    //         </Grid>
    //     )}
    //     <Typography
    //         to={`/${username}`}
    //         sx={{ color: "light.main" }}
    //         component={Link}
    //         variant="subtitle1"
    //     >
    //         {username}
    //     </Typography>
    //     {title && (
    //         <Typography sx={{ fontWeight: 800 }} paragraph m={0}>
    //             {title}
    //         </Typography>
    //     )}
    //     {description && (
    //         <Typography paragraph m={0}>
    //             {description}
    //         </Typography>
    //     )}
    // </Paper>
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
    imageThumbnails: PropTypes.arrayOf(PropTypes.string),
    /**
     * Number of images included in the gallery.
     */
    imageCount: PropTypes.number.isRequired
};

export default GalleryCard;
