import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
    createTheme,
    ThemeProvider,
    lighten,
    darken
} from "@mui/material/styles";
import "@fontsource/inter/variable-full.css";
import "./App.styles.scss";
import { Toaster } from "react-hot-toast";
import { Home, Login, Register, Profile, Gallery, Error } from "./pages";
import { NavBar } from "./components";

const theme = createTheme({
    typography: {
        fontFamily: "\"Inter\", sans-serif"
    },
    palette: {
        primary: {
            main: "#26081C",
            contrastText: "#fff"
        },
        secondary: {
            main: "#000",
            contrastText: "#fff"
        },
        negative: {
            main: "#C64025",
            contrastText: "#fff"
        },
        light: {
            main: "#c7c7c7",
            contrastText: "#000"
        }
    },
    shape: {
        borderRadius: 8
    },

    components: {
        MuiIconButton: {
            variants: [
                {
                    props: { variant: "light" },
                    style: {
                        background: "#F9F9F9",
                        color: "#000",
                        "&:hover": {
                            background: darken("#F9F9F9", 0.05)
                        }
                    }
                },
                {
                    props: { variant: "negative" },
                    style: {
                        background: "#F9F9F9",
                        color: "#000",
                        "&:hover": {
                            color: "#DD1C1A",
                            backgroundColor: "#fddce2",
                            borderColor: "#fddce2"
                        }
                    }
                }
            ]
        },

        MuiButton: {
            variants: [
                {
                    props: { variant: "primary" },
                    style: {
                        borderRadius: 500, // setting a very big border-radius, makes the shape appear pill-like
                        background: "#26081C",
                        color: "#fff",
                        "&:hover": {
                            background: lighten("#26081C", 0.1)
                        }
                    }
                },
                {
                    props: { variant: "black" },
                    style: {
                        borderRadius: 100, // setting a very big border-radius, makes the shape appear pill-like
                        background: "#000",
                        color: "#fff",
                        "&:hover": {
                            background: lighten("#000", 0.1)
                        },

                        "&:disabled": {
                            color: "#949494",
                            border: "1px solid #e6e6e6",
                            background: darken("#fff", 0.01)
                        }
                    }
                },
                {
                    props: { variant: "light" },
                    style: {
                        borderRadius: 100, // setting a very big border-radius, makes the shape appear pill-like
                        background: darken("#fff", 0.08),
                        color: "#000",
                        "&:hover": {
                            background: darken("#fff", 0.15)
                        },

                        "&:disabled": {
                            color: "#949494",
                            border: "1px solid #e6e6e6",
                            background: darken("#fff", 0.01)
                        }
                    }
                }
            ]
        }
    }
});

const App = () => (
    <ThemeProvider theme={theme}>
        <Router>
            <NavBar />
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route exact path="/login">
                    <Login />
                </Route>
                <Route exact path="/register">
                    <Register />
                </Route>
                <Route exact path="/:username">
                    <Profile />
                </Route>
                <Route exact path="/galleries/:id">
                    <Gallery />
                </Route>
                <Route path="*">
                    <Error title="Page Not Found" />
                </Route>
            </Switch>
        </Router>
        <Toaster position="bottom-center" />
    </ThemeProvider>
);

export default App;
