import React, { useCallback } from "react";
import {
    Paper as MuiPaper,
    Grid,
    Box,
    Typography,
    darken,
    styled
} from "@mui/material";
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

/**
 * The image tag, but rounded and with the photo which cover's the container
 */
const Img = styled("img")({
    borderRadius: 12,
    objectFit: "cover"
});

const GalleryCard = ({
    username,
    description,
    imageThumbnailHeight,
    imageThumbnails,
    imageCount
}) => {
    /**
     * Formats the username to be lowercase, and include an @ symbol at the beginning.
     * @return the username in lowercase and prefixed with an @
     */
    const formattedUsername = useCallback(() => {
        const loweredUsername = username.toLowerCase();
        if (username.startsWith("@")) {
            // username is already prefixed with an @ symbol,
            // simply return it lowered.
            return loweredUsername;
        }

        // prefix with an @ symbol and return
        return `@${loweredUsername}`;
    }, [username]);

    return (
        <Paper elevation={0}>
            {imageThumbnails && (
                <Grid mb={2} container columnSpacing={1.5}>
                    {imageThumbnails.map(thumbnailSrc => (
                        <Grid key={thumbnailSrc} item xs>
                            <Img
                                width="100%"
                                height={imageThumbnailHeight}
                                src={thumbnailSrc}
                                alt="Gallery image thumbnail"
                            />
                        </Grid>
                    ))}

                    {imageCount > 3 && (
                        <Grid item xs>
                            <Box
                                display="flex"
                                height={imageThumbnailHeight}
                                alignItems="center"
                                justifyContent="center"
                                borderRadius="12px"
                                border="2px solid #F7F9F9"
                                title={`Gallery contains ${imageCount} image(s)`}
                            >
                                <Typography fontWeight={600}>
                                    +{imageCount - 3}
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            )}
            <Typography sx={{ fontWeight: 600 }} variant="subtitle1">
                {formattedUsername()}
            </Typography>
            {description && (
                <Typography paragraph m={0}>
                    {description}
                </Typography>
            )}
        </Paper>
    );
};

GalleryCard.defaultProps = {
    description: null,
    imageThumbnailHeight: 146,
    // array of thumbnail src's
    imageThumbnails: []
};

GalleryCard.propTypes = {
    /**
     * The username of the gallery owner.
     * Will automatically prefix with @ if not.
     */
    username: PropTypes.string.isRequired,
    /**
     *
     */
    description: PropTypes.string,
    imageThumbnailHeight: PropTypes.number,
    imageThumbnails: PropTypes.arrayOf(PropTypes.string),
    imageCount: PropTypes.number.isRequired
};

export default GalleryCard;
