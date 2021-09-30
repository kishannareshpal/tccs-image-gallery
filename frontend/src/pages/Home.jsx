import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import GalleryCard from "../components/GalleryCard";
import NetworkServices from "../services/network.services";
import useUser from "../hooks/useUser";

const Home = () => {
    const { user, isAuthenticated } = useUser();
    const [galleries, setGalleries] = useState([]);

    useEffect(() => {
        const fetchGalleries = async () => {
            try {
                const { data } = await NetworkServices.getAllGalleries();
                if (data.code === 200) {
                    // Success
                    setGalleries(data.data.galleries);
                }
            } catch (err) {
                // Server side error occured
            }
        };
        fetchGalleries();
    }, []);

    return (
        <Container sx={{ py: 12 }}>
            <Typography variant="h4" fontWeight={800} mb={4}>
                Explore
            </Typography>
            {galleries.length === 0 ? (
                <Box>
                    <Typography color="light.main" paragraph>
                        There are no galleries at all!{" "}
                        {isAuthenticated
                            ? "Be the first to create on through your profile."
                            : "Register an account or login to add your own gallery!"}
                    </Typography>
                </Box>
            ) : (
                <Grid container columnSpacing={2} rowSpacing={4}>
                    {galleries.map(gallery => (
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
                                username={gallery.user.username}
                                photosCount={gallery.photos_count}
                                thumbnailURL={gallery.thumbnail_url}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default Home;
