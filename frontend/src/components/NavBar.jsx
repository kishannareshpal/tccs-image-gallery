import React from "react";
import {
    Container,
    Box,
    AppBar,
    Toolbar,
    Button,
    styled,
    lighten
} from "@mui/material";
import AppLogoPNG from "../assets/images/app_logo.png";

const CreateButton = styled(Button)({
    borderRadius: 500, // setting a very big border-radius, makes the shape appear pill-like
    background: "#000",
    color: "#fff",
    "&:hover": {
        background: lighten("#000", 0.2)
    }
});

const NavBar = () => (
    <AppBar elevation={0} sx={{ backgroundColor: "white" }} position="static">
        <Container>
            <Toolbar disableGutters>
                <img src={AppLogoPNG} alt="App logo" height={48} />
                <Box sx={{ flexGrow: 1 }} />
                <CreateButton size="large" sx={{ px: 2 }}>
                    Create gallery
                </CreateButton>
            </Toolbar>
        </Container>
    </AppBar>
);

export default NavBar;
