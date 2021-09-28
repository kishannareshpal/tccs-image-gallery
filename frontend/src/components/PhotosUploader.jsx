import React, { useState, useCallback } from "react";
import {
    Box,
    Grid,
    Typography,
    Alert,
    Button,
    Stack,
    styled,
    LinearProgress
} from "@mui/material";
import { Upload } from "@mui/icons-material";
import { nanoid } from "nanoid";
import pluralize from "pluralize";
import { toast } from "react-hot-toast";
import PropTypes from "prop-types";
import RoundImage from "./RoundImage";
import useUser from "../hooks/useUser";
import VerySimpleButton from "./VerySimpleButton";
import NetworkServices from "../services/network.services";

/**
 * The container
 */
const PhotosUploaderContainer = styled(Box)({
    textAlign: "start",
    marginTop: 28,
    padding: 24,
    backgroundColor: "#F5F6F9",
    border: "2px solid #E6E8EC",
    borderRadius: 12
});

/**
 * An input that is hidden
 */
const HiddenInput = styled("input")({
    display: "none"
});

const PhotoUploader = ({
    galleryId,
    onPhotoPreview,
    maxSizePerFileInBytes
}) => {
    const { user } = useUser();
    const [selectedPhotosFiles, setSelectedPhotosFiles] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    /**
     * Returns the count of the selected photos files
     * @returns {int} The number of photos that are choosen
     */
    const selectedPhotosCount = () => selectedPhotosFiles.length;

    const removeSelectedPhotoFile = useCallback(
        /**
         * Remove a single photo from the list of the {@link selectedPhotosFiles}.
         * @param {int} index The index of the photo that is being removed from the {@link selectedPhotosFiles}.
         */
        index => {
            setErrorMessage("");

            const prev = [...selectedPhotosFiles];
            prev.splice(index, 1);
            setSelectedPhotosFiles(prev);
        },
        [selectedPhotosFiles]
    );

    /**
     * Remove all of the selected photos files.
     */
    const clearSelectedPhotosFiles = () => {
        setErrorMessage("");
        setSelectedPhotosFiles([]);
    };

    /**
     * Handles on input photo file selection change.
     * @param {UIEvent} e The change event occured in the input
     */
    const onPhotosSelect = e => {
        setErrorMessage("");
        const { files } = e.target;
        const filesCount = files.length;

        // No photos selected. Do nothing
        if (filesCount === 0) {
            return;
        }

        if (filesCount > 10) {
            // Selected more than 10 photos. Not allowed
            setErrorMessage(
                "Sorry! You are only allowed to upload a maximum of 10 photos at a time"
            );
        } else {
            // Check whether each photo size does not exceed the maximum allowed.
            const allowedFiles = [];
            const disallowedFileNames = [];
            for (let i = 0; i < filesCount; i += 1) {
                const file = files[i];
                if (file.size < maxSizePerFileInBytes) {
                    // Allowed. Does not exceed limit
                    allowedFiles.push(file);
                } else {
                    // Exceeds maximum size limit per file
                    disallowedFileNames.push(file.name);
                }
            }

            if (allowedFiles.length < filesCount) {
                const maxSizeInMB = maxSizePerFileInBytes / 1000000;
                setErrorMessage(
                    <>
                        {maxSizeInMB} MB size limit per file exceeded for:
                        {disallowedFileNames.map(name => (
                            <div>
                                - <u>{name}</u>
                            </div>
                        ))}
                    </>
                );
            }
            setSelectedPhotosFiles(allowedFiles);
        }
    };

    const createSelectedPhotosPreviewItems = useCallback(
        /**
         * Loop through the {@link selectedPhotosFiles} and return MuiGrid items for Previewing selected photos.
         * @returns {JSX.Element} List of (MuiGrid items) to be used in (MuiGrid container)
         */
        () => {
            const items = [];
            for (let i = 0; i < selectedPhotosFiles.length; i += 1) {
                const file = selectedPhotosFiles[i];
                const tempImageURL = URL.createObjectURL(file);

                items.push(
                    <Grid
                        key={file.name + nanoid()}
                        textAlign="center"
                        item
                        xs={2}
                    >
                        <RoundImage
                            sx={{
                                border: "2px solid #E6E8EC",
                                cursor: "zoom-in"
                            }}
                            onClick={() => onPhotoPreview(tempImageURL)}
                            width="100%"
                            height={92}
                            src={tempImageURL}
                        />

                        <VerySimpleButton
                            disabled={isUploading}
                            onClick={() => removeSelectedPhotoFile(i)}
                            sx={{ fontWeight: "400" }}
                        >
                            Remove
                        </VerySimpleButton>
                    </Grid>
                );
            }
            return items;
        },
        [
            onPhotoPreview,
            removeSelectedPhotoFile,
            selectedPhotosFiles,
            isUploading
        ]
    );

    const onPhotosSubmit = useCallback(
        /**
         * Handle selected photos files submission
         */
        async () => {
            // Reset error messages
            setErrorMessage(null);
            // Notify that upload started
            setIsUploading(true);

            // Prepare the photos files to be uploaded
            const formData = new FormData();
            for (let i = 0; i < selectedPhotosFiles.length; i += 1) {
                // Append each selected file
                const file = selectedPhotosFiles[i];
                formData.append("photos[]", file);
            }

            try {
                // Request upload
                const { data } = await NetworkServices.postGalleryPhotos(
                    galleryId,
                    formData,
                    user.token
                );

                if (data.code === 200) {
                    // Successful upload
                    toast.success("Succesfully uploaded to the gallery!");
                    // Clear the previously selected photos.
                    setSelectedPhotosFiles([]);
                } else if (data.code === 400) {
                    // Error on upload
                    setErrorMessage(data.message);
                }

                setIsUploading(false);
            } catch (error) {
                // The server could not handle selected files
                setErrorMessage(
                    "Could not upload the selected photos. Please try again"
                );
                setIsUploading(false);
            }
        },
        [galleryId, selectedPhotosFiles, user.token]
    );

    return (
        <PhotosUploaderContainer>
            {isUploading && <LinearProgress />}
            <Grid container sx={{ mt: 2 }}>
                <Grid
                    item
                    container
                    xs={12}
                    spacing={1}
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Grid item xs>
                        <Typography variant="h6" fontWeight={600}>
                            {!isUploading
                                ? "Upload photos to this gallery"
                                : "Uploading..."}
                        </Typography>
                        {selectedPhotosFiles.length > 0 && (
                            <Box>
                                <Typography
                                    paragraph
                                    mr={2}
                                    fontWeight={400}
                                    component="span"
                                >
                                    {selectedPhotosCount()}/10{" "}
                                    {pluralize("photo", selectedPhotosCount())}{" "}
                                    selected
                                </Typography>

                                <VerySimpleButton
                                    disabled={isUploading}
                                    onClick={clearSelectedPhotosFiles}
                                >
                                    Clear
                                </VerySimpleButton>
                            </Box>
                        )}
                    </Grid>
                    <Grid item xs={12} sm="auto">
                        <Stack direction="row" spacing={1}>
                            <label htmlFor="upload-image">
                                <HiddenInput
                                    accept="image/jpeg, image/png"
                                    id="upload-image"
                                    disabled={isUploading}
                                    multiple
                                    onChange={onPhotosSelect}
                                    type="file"
                                />
                                <Button
                                    startIcon={<Upload />}
                                    disabled={isUploading}
                                    component="span"
                                    variant={
                                        selectedPhotosCount() === 0
                                            ? "black"
                                            : "light"
                                    }
                                >
                                    {selectedPhotosCount() === 0
                                        ? "Upload"
                                        : "Choose others"}
                                </Button>
                            </label>

                            {selectedPhotosFiles.length > 0 && (
                                <Button
                                    disabled={isUploading}
                                    onClick={onPhotosSubmit}
                                    variant="black"
                                >
                                    Confirm
                                </Button>
                            )}
                        </Stack>
                    </Grid>
                </Grid>

                <Grid
                    sx={{
                        mt: 2,
                        opacity: isUploading ? 0.5 : 1
                    }}
                    item
                    container
                    xs={12}
                    spacing={2}
                >
                    {createSelectedPhotosPreviewItems()}
                </Grid>
            </Grid>

            {errorMessage && (
                <Alert
                    onClose={() => setErrorMessage("")}
                    sx={{ mt: 3 }}
                    severity="error"
                >
                    {errorMessage}
                </Alert>
            )}
        </PhotosUploaderContainer>
    );
};

PhotoUploader.defaultProps = {
    maxSizePerFileInBytes: 8000000 // 8 MegaBytes
};

PhotoUploader.propTypes = {
    maxSizePerFileInBytes: PropTypes.number
};

export default PhotoUploader;
