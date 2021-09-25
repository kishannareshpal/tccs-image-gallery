import React, { useEffect, useState } from "react";
import { Container, Typography, Grid } from "@mui/material";
import GalleryCard from "../components/GalleryCard";
import NetworkServices from "../services/network.services";

const Home = () => {
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
        <Container sx={{ pt: 4, pb: 12 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
                Explore
            </Typography>

            <Grid container columnSpacing={2} rowSpacing={4}>
                {galleries.map(gallery => (
                    <Grid key={gallery.id} item xs={12} sm={6} md={4} lg={3}>
                        <GalleryCard
                            galleryId={gallery.id}
                            title={gallery.title}
                            description={gallery.description}
                            username={gallery.user.username}
                            imageThumbnails={[
                                "https://source.unsplash.com/user/mark"
                            ]}
                            imageCount={1}
                        />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Home;
