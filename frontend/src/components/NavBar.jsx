import React from "react";
import {
    Container,
    Box,
    AppBar as MuiAppBar,
    Toolbar,
    styled
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import useUser from "../hooks/useUser";
import NavLink from "./NavLink";
import LogoutButton from "./LogoutButton";
import AppLogoPNG from "../assets/images/app_logo.png";

const AppBar = styled(MuiAppBar)({
    backgroundColor: "rgba(255,255,255,0.72)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: "1px solid #dedede"
});

const NavBar = () => {
    const { user, isAuthenticated } = useUser();
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

                    {isAuthenticated && (
                        <>
                            <NavLink
                                active={location.pathname === "/"}
                                underline="none"
                                component={Link}
                                to="/"
                                sx={{ ml: 2 }}
                            >
                                Explore
                            </NavLink>

                            <NavLink
                                active={
                                    location.pathname === `/${user.username}`
                                }
                                underline="none"
                                component={Link}
                                to={`/${user.username}`}
                            >
                                Your Profile
                            </NavLink>
                        </>
                    )}

                    <Box sx={{ flexGrow: 1 }} />

                    {!isAuthenticated && !isAtAuthPage() && (
                        <>
                            <NavLink
                                underline="none"
                                component={Link}
                                to="/login"
                                sx={{ mr: 1 }}
                            >
                                Login
                            </NavLink>

                            <NavLink
                                black
                                underline="none"
                                component={Link}
                                to="/register"
                            >
                                Register
                            </NavLink>
                        </>
                    )}

                    {isAuthenticated && <LogoutButton />}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default NavBar;
