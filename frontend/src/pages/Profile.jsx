import React, { useState, useEffect } from "react";
import {
    Container,
    Button,
    Typography,
    Stack,
    Alert,
    styled,
    Box,
    TextField,
    Grid
} from "@mui/material";
import { useImmer } from "use-immer";
import { useParams, useHistory } from "react-router-dom";
import { Add } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { isEmpty } from "lodash";
import toast from "react-hot-toast";
import Error from "./Error";
import useUser from "../hooks/useUser";
import {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    DialogActionButton
} from "../components/Dialog";
import NetworkServices from "../services/network.services";
import { GalleryCard } from "../components";

/**
 * Styled `span` tag, which represents the gallery count
 */
const CountSpan = styled("span")(({ theme }) => ({
    marginLeft: 12,
    color: theme.palette.light.main
}));

/**
 * Validation schema for creating a new gallery
 */
const newGallerySchema = yup
    .object({
        title: yup.string().min(1).max(70).required().label("Title"),
        description: yup.string().optional().max(300).label("Description")
    })
    .required();

const Profile = () => {
    const { username } = useParams();
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);
    const [serverErrorMessage, setServerErrorMessage] = useState();
    const [serverErrors, setServerErrors] = useState({});
    const [shouldDisableInputs, setShouldDisableInputs] = useState(false);
    const { user, isAuthenticated } = useUser();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [userProfile, setUserProfile] = useImmer();
    const {
        register,
        handleSubmit,
        formState: { errors: clientErrors },
        reset
    } = useForm({
        resolver: yupResolver(newGallerySchema)
    });

    const getUserGalleryCount = () => {
        if (isEmpty(userProfile)) {
            return 0;
        }
        return userProfile.galleries.length;
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        // Reset the error messages
        setServerErrorMessage(null);
        setServerErrors({});
        setShouldDisableInputs(false);
        // Reset the new gallery form values
        reset();
    };

    const onNewGallerySubmit = async galleryData => {
        setShouldDisableInputs(true);
        try {
            const { data } = await NetworkServices.postGallery(
                galleryData,
                user.token
            );
            if (data.code === 200) {
                // Succesfully saved
                toast.success("New gallery added!");
                const newGallery = data.data.gallery;
                setUserProfile(draft => {
                    draft.galleries.unshift(newGallery);
                });
                handleDialogClose();
                reset();
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
                "Could not create a new gallery. Please try again"
            );
            setShouldDisableInputs(false);
        }
    };

    useEffect(() => {
        // Fetch the user profile on load
        const loadUserProfile = async () => {
            try {
                const { data } = await NetworkServices.getUserProfile(username);
                if (data.code === 200) {
                    // Got the profile
                    setUserProfile(data.data.user);
                } else if (data.code === 404) {
                    // User not found
                    setUserProfile(null);
                }
            } catch (err) {
                // Could not load the user
            }
            setIsLoading(false);
        };

        // Make sure the username param is valid
        if (username.startsWith("@")) {
            // Strip out all the @ symbol at the start
            const normalizedUsername = username.replace(/^@+/g, "");
            history.push(`/${normalizedUsername}`);
        } else {
            // Fetch the user profile
            loadUserProfile();
        }
    }, [username, history, setUserProfile]);

    if (isLoading) return null;
    return !userProfile && !isLoading ? (
        <Error title="User Not Found" description={`@${username}`} />
    ) : (
        <Box sx={{ pb: 12 }}>
            <Box
                sx={{
                    backgroundColor: "#0B090A",
                    color: "primary.contrastText",
                    py: 6,
                    mb: 4
                }}
            >
                <Container>
                    <Typography fontWeight={800} mb={0} variant="h2">
                        {userProfile.full_name}
                    </Typography>
                    <Typography
                        fontWeight={600}
                        color="light.main"
                        variant="h5"
                    >
                        @{username}
                    </Typography>
                </Container>
            </Box>

            <Container>
                <Stack
                    sx={{ mb: 2 }}
                    justifyContent="space-between"
                    direction="row"
                >
                    <Typography
                        sx={{ fontWeight: 600, color: "#000" }}
                        variant="h6"
                    >
                        Galleries <CountSpan>{getUserGalleryCount()}</CountSpan>
                    </Typography>

                    {isAuthenticated && user.username === username && (
                        <Button
                            onClick={() => setIsDialogOpen(true)}
                            startIcon={<Add />}
                            variant="black"
                        >
                            New Gallery
                        </Button>
                    )}
                </Stack>

                <Grid container spacing={2}>
                    {userProfile.galleries &&
                        userProfile.galleries.map(gallery => (
                            <Grid
                                key={gallery.id}
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                            >
                                <GalleryCard
                                    galleryId={gallery.id}
                                    title={gallery.title}
                                    description={gallery.description}
                                    username={userProfile.username}
                                    photosCount={gallery.photos_count}
                                    thumbnailURL={gallery.thumbnail_url}
                                />
                            </Grid>
                        ))}
                </Grid>
            </Container>

            <Dialog
                fullWidth
                disableEscapeKeyDown={shouldDisableInputs}
                onBackdropClick={() => !shouldDisableInputs}
                maxWidth="xs"
                onClose={handleDialogClose}
                open={isDialogOpen}
            >
                <DialogTitle variant="h5">New Gallery</DialogTitle>

                <form onSubmit={handleSubmit(onNewGallerySubmit)}>
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
                            onClick={handleDialogClose}
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
                            Create
                        </DialogActionButton>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default Profile;
