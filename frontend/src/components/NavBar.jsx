import React from "react";
import {
    Container,
    Box,
    AppBar as MuiAppBar,
    Toolbar,
    Button,
    styled
} from "@mui/material";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import useUser from "../hooks/useUser";
import AppLogoPNG from "../assets/images/app_logo.png";

const AppBar = styled(MuiAppBar)({
    backgroundColor: "rgba(255,255,255,0.72)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: "1px solid #dedede"
});

const NavBar = () => {
    const { user, isAuthenticated, setUser } = useUser();

    return (
        <AppBar elevation={0} position="sticky">
            <Container>
                <Toolbar disableGutters>
                    <Link to="/">
                        <img src={AppLogoPNG} alt="App logo" height={48} />
                    </Link>
                    <Box sx={{ flexGrow: 1 }} />
                    {!isAuthenticated ? (
                        <Button
                            component={Link}
                            to="/login"
                            variant="light"
                            sx={{ px: 2 }}
                        >
                            Login
                        </Button>
                    ) : (
                        <LogoutButton />
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default NavBar;
