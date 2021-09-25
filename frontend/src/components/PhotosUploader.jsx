import React, { useState } from "react";
import {
    Box,
    Grid,
    Typography,
    Divider,
    Button,
    Stack,
    IconButton,
    styled
} from "@mui/material";
import { Close, Upload } from "@mui/icons-material";
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";
import RoundImage from "./RoundImage";
import VerySimpleButton from "./VerySimpleButton";

const HiddenInput = styled("input")({
    display: "none"
});

const ImgUploadBox = styled(Box)({
    textAlign: "start",
    marginTop: 28,
    padding: 24,
    backgroundColor: "#F5F6F9",
    border: "2px solid #E6E8EC",
    borderRadius: 12
});

const PhotoUploader = () => {
    const [selectedPhotoFiles, setSelectedPhotoFiles] = useState([]);
    const { register, handleSubmit } = useForm();

    const selectedPhotosCount = () => selectedPhotoFiles.length;

    const removeSelectedPhotoFile = index => {
        const prev = [...selectedPhotoFiles];
        prev.splice(index, 1);
        setSelectedPhotoFiles(prev);
    };

    const clearSelectedPhotosFiles = () => setSelectedPhotoFiles([]);

    const onFileInputChange = e => {
        // Grab the selected image files
        const { files } = e.target;
        if (files.length === 0) {
            // No image file selected, do nothing
            return;
        }

        // Add to the list of selected images
        setSelectedPhotoFiles(prev => [...prev, ...files]);
    };

    const createSelectedPhotosGridItems = () => {
        const items = [];
        for (let i = 0; i < selectedPhotoFiles.length; i += 1) {
            const file = selectedPhotoFiles[i];

            items.push(
                <Grid key={file.name + nanoid()} textAlign="center" item xs={2}>
                    <RoundImage
                        sx={{ border: "2px solid #E6E8EC", cursor: "zoom-in" }}
                        width="100%"
                        height={64}
                        src={URL.createObjectURL(file)}
                    />

                    <VerySimpleButton
                        onClick={() => removeSelectedPhotoFile(i)}
                        sx={{ fontWeight: "400" }}
                    >
                        Remove
                    </VerySimpleButton>
                </Grid>
            );
        }
        return items;
    };

    const onPhotosSubmit = data => {
        console.log("post files", data);
    };

    return (
        <ImgUploadBox>
            <Grid
                container
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
            >
                <Grid item xs>
                    <Typography variant="h6" fontWeight={600}>
                        Upload photos to this gallery
                    </Typography>
                    {selectedPhotoFiles.length > 0 && (
                        <Box>
                            <Typography
                                paragraph
                                mr={2}
                                fontWeight={400}
                                component="span"
                            >
                                {selectedPhotosCount()} photos selected
                            </Typography>

                            <VerySimpleButton
                                onClick={clearSelectedPhotosFiles}
                            >
                                Clear
                            </VerySimpleButton>
                        </Box>
                    )}
                </Grid>
                <Grid item xs={12} sm="auto">
                    <form onSubmit={handleSubmit(onPhotosSubmit)}>
                        <Stack direction="row" spacing={1}>
                            <label htmlFor="upload-image">
                                <HiddenInput
                                    accept="image/*"
                                    id="upload-image"
                                    {...register("photos")}
                                    multiple
                                    onChange={onFileInputChange}
                                    type="file"
                                />
                                <Button
                                    startIcon={<Upload />}
                                    variant={
                                        selectedPhotosCount() === 0
                                            ? "black"
                                            : "light"
                                    }
                                    component="span"
                                >
                                    {selectedPhotosCount() === 0
                                        ? "Upload"
                                        : "Upload more"}
                                </Button>
                            </label>

                            {selectedPhotoFiles.length > 0 && (
                                <Button type="submit" variant="black">
                                    Confirm
                                </Button>
                            )}
                        </Stack>
                    </form>
                </Grid>
            </Grid>

            <Grid container sx={{ mt: 1, mb: 2 }} spacing={2}>
                {createSelectedPhotosGridItems()}
            </Grid>

            <Typography variant="subtitle2" fontWeight={400}>
                Drag and drop image files here, or{" "}
                <label htmlFor="upload-image">
                    <strong>
                        <u>click to browse images</u>
                    </strong>
                </label>
                .
            </Typography>
            <Typography variant="subtitle2" color="#bbbbbb" fontWeight={400}>
                (jpg, png, gif)
            </Typography>
        </ImgUploadBox>
    );
};

export default PhotoUploader;
