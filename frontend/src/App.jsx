import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createTheme, ThemeProvider, lighten } from "@mui/material/styles";
import "@fontsource/inter/variable-full.css";
import "./App.styles.scss";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NavBar from "./components/NavBar";

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
        }
    },
    shape: {
        borderRadius: 8
    },

    components: {
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
                        borderRadius: 500, // setting a very big border-radius, makes the shape appear pill-like
                        background: "#000",
                        color: "#fff",
                        "&:hover": {
                            background: lighten("#000", 0.1)
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
            </Switch>
        </Router>
    </ThemeProvider>
);

export default App;
