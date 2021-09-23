import React from "react";
import {
    Container,
    Box,
    AppBar as MuiAppBar,
    Toolbar,
    Link as MuiLink,
    Button,
    styled
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import useUser from "../hooks/useUser";
import AppLogoPNG from "../assets/images/app_logo.png";

const AppBar = styled(MuiAppBar)({
    backgroundColor: "rgba(255,255,255,0.72)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: "1px solid #dedede"
});

const NavBarLink = styled(MuiLink, {
    shouldForwardProp: prop => prop !== "black"
})(({ black }) => ({
    borderRadius: 100,
    padding: "8px 16px",
    backgroundColor: black ? "#000" : "transparent",
    color: black ? "#fff" : "#000"
}));

const NavBar = () => {
    const { isAuthenticated } = useUser();
    const location = useLocation();

    const isAtAuthPage = () =>
        location.pathname === "/login" || location.pathname === "/register";

    return (
        <AppBar elevation={0} position="sticky">
            <Container>
                <Toolbar disableGutters>
                    <Link to="/">
                        <img src={AppLogoPNG} alt="App logo" height={48} />
                    </Link>
                    <Box sx={{ flexGrow: 1 }} />
                    {!isAuthenticated && !isAtAuthPage() && (
                        <>
                            <NavBarLink
                                underline="none"
                                component={Link}
                                to="/login"
                                sx={{ mr: 1 }}
                            >
                                Login
                            </NavBarLink>

                            <NavBarLink
                                black
                                underline="none"
                                component={Link}
                                to="/register"
                            >
                                Register
                            </NavBarLink>
                        </>
                    )}

                    {isAuthenticated && <LogoutButton />}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default NavBar;
