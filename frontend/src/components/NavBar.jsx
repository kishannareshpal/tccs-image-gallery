import React from "react";
import {
    Container,
    Box,
    AppBar as MuiAppBar,
    Toolbar,
    Button,
    styled,
    lighten
} from "@mui/material";
import AppLogoPNG from "../assets/images/app_logo.png";

const AppBar = styled(MuiAppBar)({
    backgroundColor: "rgba(255,255,255,0.72)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: "1px solid #dedede"
});

const CreateButton = styled(Button)(({ theme }) => ({
    borderRadius: 500, // setting a very big border-radius, makes the shape appear pill-like
    background: theme.palette.primary.main,
    color: "#fff",
    "&:hover": {
        background: lighten(theme.palette.primary.main, 0.2)
    }
}));

const NavBar = () => (
    <AppBar elevation={0} position="sticky">
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
