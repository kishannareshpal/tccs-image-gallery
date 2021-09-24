import React, { useState, useEffect } from "react";
import {
    Container,
    Button,
    Typography,
    Stack,
    styled,
    Box,
    TextField,
    Grid
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { isEmpty } from "lodash";
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
const schema = yup
    .object({
        title: yup.string().min(1).max(70).required().label("Title"),
        description: yup.string().optional().max(300).label("Description")
    })
    .required();

const Profile = () => {
    const { username } = useParams();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [userProfile, setUserProfile] = useState({});
    const {
        register,
        handleSubmit,
        formState: { errors: clientErrors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    const getUserGalleryCount = () => {
        if (isEmpty(userProfile)) {
            return 0;
        }
        return userProfile.galleries.length;
    };

    const onNewGallerySubmit = data => {
        // TODO: Add a new gallery!
    };

    useEffect(() => {
        const fetchUserGalleries = async () => {
            try {
                const { data } = await NetworkServices.getUserProfile(username);
                if (data.code === 200) {
                    // Got the galleries
                    setUserProfile(data.data.user);
                } else if (data.code === 404) {
                    // No user found
                    // TODO:
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchUserGalleries();
    }, [username]);

    return (
        <Box>
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
                        sx={{ fontWeight: 800, color: "light.main" }}
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

                    <Button
                        onClick={() => setIsDialogOpen(true)}
                        startIcon={<Add />}
                        variant="black"
                    >
                        New Gallery
                    </Button>
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
                maxWidth="xs"
                onClose={() => setIsDialogOpen(false)}
                open={isDialogOpen}
            >
                <DialogTitle variant="h5">New Gallery</DialogTitle>
                <form onSubmit={handleSubmit(onNewGallerySubmit)}>
                    <DialogContent>
                        <TextField
                            error={!!clientErrors.title?.message}
                            label="Title"
                            {...register("title")}
                            sx={{ mb: 2 }}
                            helperText={clientErrors.title?.message}
                            fullWidth
                            variant="outlined"
                        />
                        <TextField
                            error={!!clientErrors.description?.message}
                            label="Description (optional)"
                            fullWidth
                            {...register("description")}
                            helperText={clientErrors.description?.message}
                            multiline
                            rows={4}
                            variant="outlined"
                        />
                    </DialogContent>

                    <DialogActions>
                        <DialogActionButton
                            onClick={() => setIsDialogOpen(false)}
                            cancel
                            size="large"
                            fullWidth
                        >
                            Cancel
                        </DialogActionButton>
                        <DialogActionButton
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
