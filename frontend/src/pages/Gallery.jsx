import React from "react";
import { Container, Typography } from "@mui/material";

const Gallery = () => (
    <Container sx={{ py: 12 }}>
        <Typography variant="h1" fontWeight={800} marginBottom>
            My first gallery
        </Typography>
        <Typography variant="h5">Kishan Jadav</Typography>
        <Typography variant="subtitle2">@kishannareshpal</Typography>
    </Container>
);

export default Gallery;
