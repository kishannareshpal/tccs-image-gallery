import React from "react";
import { Container, Typography, styled, Box, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { GalleryCard } from "../components";

const CountSpan = styled("span")(({ theme }) => ({
    marginLeft: 12,
    color: theme.palette.light.main
}));

const Profile = () => {
    const { username } = useParams();

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
                        Full Name
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
                <Typography
                    sx={{ fontWeight: 600, color: "#000", mb: 2 }}
                    variant="h6"
                >
                    Galleries <CountSpan>2</CountSpan>
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <GalleryCard
                            username="@kishannareshpal"
                            description="My personal gallery"
                            imageThumbnails={[
                                "https://source.unsplash.com/user/mark"
                            ]}
                            imageCount={1}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <GalleryCard
                            username="kishannareshpal"
                            imageThumbnails={[
                                "https://source.unsplash.com/user/erondu",
                                "https://source.unsplash.com/user/alex_quezada",
                                "https://source.unsplash.com/user/helenngoc"
                            ]}
                            imageCount={4}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Profile;
