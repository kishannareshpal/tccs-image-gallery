import React from "react";
import {
    Container,
    Box,
    AppBar as MuiAppBar,
    Toolbar,
    Button,
    styled
} from "@mui/material";
import AppLogoPNG from "../assets/images/app_logo.png";

const AppBar = styled(MuiAppBar)({
    backgroundColor: "rgba(255,255,255,0.72)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: "1px solid #dedede"
});

const NavBar = () => (
    <AppBar elevation={0} position="sticky">
        <Container>
            <Toolbar disableGutters>
                <img src={AppLogoPNG} alt="App logo" height={48} />
                <Box sx={{ flexGrow: 1 }} />
                <Button variant="primary" sx={{ px: 2 }}>
                    Create gallery
                </Button>
            </Toolbar>
        </Container>
    </AppBar>
);

export default NavBar;
