import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "@fontsource/inter/variable-full.css";
import "./App.styles.scss";
import Home from "./pages/Home";
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
    }
});

const App = () => (
    <ThemeProvider theme={theme}>
        <NavBar />
        <Router>
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
            </Switch>
        </Router>
    </ThemeProvider>
);

export default App;
