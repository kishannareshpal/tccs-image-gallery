import React, { useState, useEffect, useRef } from "react";
import { useImmer } from "use-immer";
import {
    Container,
    Box,
    Grid,
    Typography,
    Divider,
    IconButton,
    Stack,
    Button,
    TextField,
    Alert
} from "@mui/material";
import { Link, useParams, Redirect } from "react-router-dom";
import toast from "react-hot-toast";
import { EditOutlined, DeleteOutlineSharp } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    DialogActionButton
} from "../components/Dialog";
import useUser from "../hooks/useUser";
import NetworkServices from "../services/network.services";
import {
    PhotoCard,
    PhotosUploader,
    Lightbox,
    VerySimpleButton
} from "../components";

/**
 * Validation schema for creating a new gallery
 */
const editGallerySchema = yup
    .object({
        title: yup.string().min(1).max(70).required().label("Title"),
        description: yup.string().optional().max(300).label("Description")
    })
    .required();

const Gallery = () => {
    const { id } = useParams();
    const { user, isAuthenticated } = useUser();
    const [gallery, setGallery] = useImmer();
    const [isLoading, setIsLoading] = useState(true);

    const [redirectUrl, setRedirectUrl] = useState("");

    const [isPreviewShowing, setIsPreviewShowing] = useState(false);
    const [isDeleteModalShowing, setIsDeleteModalShowing] = useState(false);
    const [isEditModalShowing, setIsEditModalShowing] = useState(false);

    const [confirmingPhotoDeletes, setConfirmingPhotoDeletes] = useImmer([]);
    const prevConfirmationTimerIdRef = useRef();

    const [previewPhotoURL, setPreviewPhotoURL] = useState("");

    const [serverErrorMessage, setServerErrorMessage] = useState();
    const [serverErrors, setServerErrors] = useState({});
    const [shouldDisableInputs, setShouldDisableInputs] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors: clientErrors },
        reset
    } = useForm({
        defaultValues: {
            title: "",
            description: ""
        },
        resolver: yupResolver(editGallerySchema)
    });

    const openDeleteModal = () => {
        setIsDeleteModalShowing(true);
    };
    const closeDeleteModal = () => setIsDeleteModalShowing(false);

    const openEditModal = () => setIsEditModalShowing(true);
    const closeEditModal = (_, shouldNotReset) => {
        // Reset the error messages
        setIsEditModalShowing(false);
        setServerErrorMessage(null);
        setServerErrors({});
        setShouldDisableInputs(false);

        // Reset the edit form values to original
        if (!shouldNotReset) {
            reset({ title: gallery.title, description: gallery.description });
        }
    };

    const onGalleryEdit = async updatedGalleryData => {
        setShouldDisableInputs(true);
        try {
            const { data } = await NetworkServices.updateGallery(
                gallery.id,
                updatedGalleryData,
                user.token
            );
            if (data.code === 200) {
                // Succesfully saved
                toast.success("Changes saved");
                const editedGallery = data.data.gallery;
                setGallery(draft => {
                    // Apply changes to the page
                    const tempDraft = draft;
                    tempDraft.title = editedGallery.title;
                    tempDraft.description = editedGallery.description;
                });
                closeEditModal(null, true);
            } else if (data.code === 400) {
                // Invalid request
                setServerErrorMessage(data.message);
                setServerErrors(data.data);
                setShouldDisableInputs(false);
            } else if (data.code === 401) {
                // Unauthorized
                setServerErrorMessage(data.message);
                setShouldDisableInputs(false);
            }
        } catch (err) {
            setServerErrorMessage(
                "Could not update the gallery. Please try again"
            );
            setShouldDisableInputs(false);
        }
    };

    const onGalleryDelete = () => {
        setShouldDisableInputs(true);
        NetworkServices.deleteGallery(gallery.id, user.token).then(
            ({ data }) => {
                if (data.code === 200) {
                    toast.success(`Gallery "${gallery.title}" was deleted!`);
                    setRedirectUrl(`/${user.username}`);
                } else {
                    toast.error(data.message);
                }
            }
        );
    };

    const onPhotoDelete = photoId => {
        // Whether the deletion of this photo is confirmed by the user
        const isDeleteConfirmed = confirmingPhotoDeletes.includes(photoId);
        if (!isDeleteConfirmed) {
            // Not yet confirmed, ask the user if they are sure they want to delete it
            setConfirmingPhotoDeletes(draft => {
                draft.push(photoId);
            });
            return;
        }

        NetworkServices.deletePhoto(photoId, user.token).then(({ data }) => {
            if (data.code === 200) {
                toast.success("Photo deleted!");
            } else {
                toast.error(data.message);
            }
        });

        // Remove the image right away for UX reasons.
        setGallery(draft => {
            const index = draft.photos.findIndex(photo => photo.id === photoId);
            if (index !== -1) {
                draft.photos.splice(index, 1);
            }
        });
    };

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
                    const fetchedGallery = data.data.gallery;
                    setGallery(fetchedGallery);

                    // Update the default values
                    reset({
                        title: fetchedGallery.title,
                        description: fetchedGallery.description
                    });
                }
                setIsLoading(false);
            } catch (error) {
                // Could not fetch the gallery
            }
        };
        fetchGallery();
    }, [id, setGallery, reset]);

    useEffect(() => {
        // Reset the confirmation notice of photo deletion back to normal after some time.

        // Clear any previous timer
        clearTimeout(prevConfirmationTimerIdRef.current);
        // Restart a new timer for 3s
        const confirmationTimerId = setTimeout(() => {
            setConfirmingPhotoDeletes([]);
        }, 3000);
        prevConfirmationTimerIdRef.current = confirmationTimerId;
        return () => {
            clearTimeout(prevConfirmationTimerIdRef.current);
        };
    }, [
        confirmingPhotoDeletes,
        prevConfirmationTimerIdRef,
        setConfirmingPhotoDeletes
    ]);

    if (isLoading) return null;
    if (redirectUrl) {
        return <Redirect to={redirectUrl} />;
    }
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
                    <Typography variant="h1" fontWeight={800} mb={2}>
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
                    <Box mt={2}>
                        <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                        >
                            <IconButton variant="light" onClick={openEditModal}>
                                <EditOutlined />
                            </IconButton>

                            <IconButton
                                variant="negative"
                                onClick={openDeleteModal}
                            >
                                <DeleteOutlineSharp />
                            </IconButton>
                        </Stack>

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
                    </Box>
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
                            {isAuthenticated &&
                                user.username === gallery.user.username && (
                                <VerySimpleButton
                                    confirming={confirmingPhotoDeletes.includes(
                                        photo.id
                                    )}
                                    onClick={() => onPhotoDelete(photo.id)}
                                >
                                    {confirmingPhotoDeletes.includes(
                                        photo.id
                                    )
                                        ? "Confirm delete?"
                                        : "Delete"}
                                </VerySimpleButton>
                            )}
                        </Grid>
                    ))}
                </Grid>
            )}

            <Dialog
                fullWidth
                disableEscapeKeyDown={shouldDisableInputs}
                onBackdropClick={() => !shouldDisableInputs}
                maxWidth="xs"
                onClose={closeDeleteModal}
                open={isDeleteModalShowing}
            >
                <DialogTitle variant="h5">
                    Delete &#34;{gallery.title}&#34;
                </DialogTitle>
                <DialogContent>
                    <Typography paragraph>
                        Deleting this gallery will also permanently delete all
                        of the photos uploaded to it.
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <DialogActionButton
                        disabled={shouldDisableInputs}
                        onClick={closeDeleteModal}
                        cancelType
                        size="large"
                        fullWidth
                    >
                        Cancel
                    </DialogActionButton>
                    <DialogActionButton
                        disabled={shouldDisableInputs}
                        type="submit"
                        onClick={onGalleryDelete}
                        negativeType
                        size="large"
                        fullWidth
                    >
                        Delete
                    </DialogActionButton>
                </DialogActions>
            </Dialog>

            <Dialog
                fullWidth
                disableEscapeKeyDown={shouldDisableInputs}
                onBackdropClick={() => !shouldDisableInputs}
                maxWidth="xs"
                onClose={closeEditModal}
                open={isEditModalShowing}
            >
                <DialogTitle variant="h5">Edit Gallery</DialogTitle>

                <form onSubmit={handleSubmit(onGalleryEdit)}>
                    <DialogContent>
                        {serverErrorMessage && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {serverErrorMessage}
                            </Alert>
                        )}

                        <TextField
                            disabled={shouldDisableInputs}
                            error={
                                !!clientErrors.title?.message ||
                                !!serverErrors.title
                            }
                            label="Title"
                            {...register("title")}
                            sx={{ mb: 2 }}
                            helperText={
                                serverErrors.title ||
                                clientErrors.title?.message
                            }
                            fullWidth
                            variant="outlined"
                        />
                        <TextField
                            disabled={shouldDisableInputs}
                            error={
                                !!clientErrors.description?.message ||
                                !!serverErrors.description
                            }
                            label="Description (optional)"
                            fullWidth
                            {...register("description")}
                            helperText={
                                serverErrors.description ||
                                clientErrors.description?.message
                            }
                            multiline
                            rows={4}
                            variant="outlined"
                        />
                    </DialogContent>

                    <DialogActions>
                        <DialogActionButton
                            disabled={shouldDisableInputs}
                            onClick={closeEditModal}
                            cancelType
                            size="large"
                            fullWidth
                        >
                            Cancel
                        </DialogActionButton>
                        <DialogActionButton
                            disabled={shouldDisableInputs}
                            type="submit"
                            confirmType
                            size="large"
                            fullWidth
                        >
                            Save
                        </DialogActionButton>
                    </DialogActions>
                </form>
            </Dialog>

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
