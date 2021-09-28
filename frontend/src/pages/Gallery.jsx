import React, { useState, useEffect } from "react";
import { useImmer } from "use-immer";
import {
    Container,
    Box,
    Grid,
    Typography,
    Divider,
    Button
} from "@mui/material";

import { Link, useParams } from "react-router-dom";
import useUser from "../hooks/useUser";
import NetworkServices from "../services/network.services";
import { PhotoCard, PhotosUploader, Lightbox } from "../components";

const Gallery = () => {
    const { id } = useParams();
    const { user, isAuthenticated } = useUser();
    const [gallery, setGallery] = useImmer();
    const [isLoading, setIsLoading] = useState(true);

    const [isPreviewShowing, setIsPreviewShowing] = useState(false);
    const [previewPhotoURL, setPreviewPhotoURL] = useState("");

    const previewPhoto = photoURL => {
        setPreviewPhotoURL(photoURL);
        setIsPreviewShowing(true);
    };

    const onPreviewShow = () => setIsPreviewShowing(true);
    const onPreviewClose = () => setIsPreviewShowing(false);

    useEffect(() => {
        setIsLoading(true);
        const fetchGallery = async () => {
            try {
                const { data } = await NetworkServices.getGallery(id);
                if (data.code === 200) {
                    // Success
                    setGallery(data.data.gallery);
                }
                setIsLoading(false);
            } catch (error) {
                // Could not fetch the gallery
            }
        };
        fetchGallery();
    }, [id, setGallery]);

    if (isLoading) return null;
    return !gallery ? (
        <Container
            sx={{
                display: "flex",
                height: "100vh",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Typography variant="h1" fontWeight="800">
                404
            </Typography>
            <Typography variant="h4">Gallery not found</Typography>
            <Button to="/" sx={{ mt: 2 }} variant="light" component={Link}>
                Return Home
            </Button>
        </Container>
    ) : (
        <Container sx={{ pt: 6, pb: 12 }}>
            <Box textAlign="center">
                <Box>
                    <Typography variant="h1" fontWeight={800} mb={4}>
                        {gallery.title}
                    </Typography>
                    {gallery.description && (
                        <Typography paragraph>{gallery.description}</Typography>
                    )}
                    <Typography variant="h5">
                        {gallery.user.full_name}
                    </Typography>
                    <Typography
                        component={Link}
                        to={`/${gallery.user.username}`}
                        variant="subtitle2"
                    >
                        @{gallery.user.username}
                    </Typography>
                    <Typography variant="subtitle1">
                        {gallery.photos.length} Photos
                    </Typography>
                </Box>

                {isAuthenticated && user.username === gallery.user.username && (
                    <PhotosUploader
                        onPhotoPreview={photoURL => {
                            previewPhoto(photoURL);
                        }}
                        onUploadComplete={uploadedPhotos => {
                            // New photos were uploaded
                            // Add them to the current list of the gallery photos!
                            setGallery(draft => {
                                draft.photos.unshift(...uploadedPhotos);
                            });
                        }}
                        galleryId={gallery.id}
                    />
                )}
            </Box>

            <Divider sx={{ my: 4 }} variant="middle" />

            {gallery.photos.length === 0 ? (
                <Box py={12} textAlign="center">
                    <Typography color="light.main" paragraph>
                        No photos on this gallery yet!
                    </Typography>
                </Box>
            ) : (
                <Grid container columnSpacing={2} rowSpacing={4}>
                    {gallery.photos.map(photo => (
                        <Grid key={photo.id} item xs={12} sm={6} md={4} lg={3}>
                            <PhotoCard
                                onClick={() =>
                                    previewPhoto(photo.full_size_url)
                                }
                                url={photo.thumbnail_url}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            <Lightbox
                open={isPreviewShowing}
                photoURL={previewPhotoURL}
                onOpen={onPreviewShow}
                onClose={onPreviewClose}
            />
        </Container>
    );
};

export default Gallery;
