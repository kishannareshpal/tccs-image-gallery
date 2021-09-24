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
import { Link, useParams, useHistory } from "react-router-dom";
import { Add } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { isEmpty } from "lodash";
import toast from "react-hot-toast";
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
    const [serverErrorMessage, setServerErrorMessage] = useState();
    const [serverErrors, setServerErrors] = useState({});
    const [shouldDisableInputs, setShouldDisableInputs] = useState(false);
    const { user, isAuthenticated } = useUser();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [userProfile, setUserProfile] = useState({});
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
            console.log(err);
            setShouldDisableInputs(false);
        }
    };

    useEffect(() => {
        // Fetch the user profile on load
        const loadUserProfile = async () => {
            try {
                const { data } = await NetworkServices.getUserProfile(username);
                if (data.code === 200) {
                    // Got the galleries
                    setUserProfile(data.data.user);
                } else if (data.code === 404) {
                    // User not found
                    setUserProfile({});
                }
            } catch (err) {
                console.log(err);
            }
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
    }, [username, history]);

    return isEmpty(userProfile) ? (
        <Container
            sx={{
                display: "flex",
                height: "100vh",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Typography variant="h1">404</Typography>
            <Typography variant="h4">User @{username} not found</Typography>
            <Button to="/" sx={{ mt: 2 }} variant="light" component={Link}>
                Return Home
            </Button>
        </Container>
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
                    <Typography sx={{ fontWeight: 800, mb: 0 }} variant="h2">
                        {userProfile.full_name}
                    </Typography>
                    <Typography
                        sx={{ fontWeight: 600, color: "light.main" }}
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
                            <Grid key={gallery.id} item xs={4}>
                                <GalleryCard
                                    username={userProfile.username}
                                    title={gallery.title}
                                    description={gallery.description}
                                    imageThumbnails={[
                                        "https://source.unsplash.com/user/mark"
                                    ]}
                                    imageCount={1}
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
                            cancel
                            size="large"
                            fullWidth
                        >
                            Cancel
                        </DialogActionButton>
                        <DialogActionButton
                            disabled={shouldDisableInputs}
                            type="submit"
                            confirm
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
