import React from "react";
import { Container, Typography, Grid } from "@mui/material";
import GalleryCard from "../components/GalleryCard";

const Home = () => (
    <Container sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
            Galleries
        </Typography>

        <Grid container spacing={2}>
            <Grid item xs={4}>
                <GalleryCard
                    username="@kishannareshpal"
                    description="My personal gallery"
                    imageThumbnails={["https://source.unsplash.com/random"]}
                    imageCount={1}
                />
            </Grid>
            <Grid item xs={4}>
                <GalleryCard
                    username="kishannareshpal"
                    imageThumbnails={[
                        "https://source.unsplash.com/user/erondu",
                        "https://source.unsplash.com/random",
                        "https://source.unsplash.com/random"
                    ]}
                    imageCount={4}
                />
            </Grid>
        </Grid>
    </Container>
);

export default Home;
