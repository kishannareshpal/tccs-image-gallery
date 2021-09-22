import React, { useState } from "react";
import {
    Container,
    Button,
    Grid,
    Typography,
    TextField,
    styled,
    lighten
} from "@mui/material";

const LoginButton = styled(Button)(({ theme }) => ({
    borderRadius: 500, // setting a very big border-radius, makes the shape appear pill-like
    background: "#000",
    color: "#fff",
    "&:hover": {
        background: lighten("#000", 0.1)
    }
}));

const Login = () => {
    /**
     * User's auth details
     */
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <Container
            sx={{
                height: "100vh"
            }}
        >
            <Grid
                container
                height="100%"
                alignItems="center"
                justifyContent="center"
            >
                <Grid item xs={12} sm={8} md={6} lg={5}>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                        Login
                    </Typography>

                    <Typography component="div" sx={{ fontWeight: 400, mb: 2 }}>
                        Welcome back!
                    </Typography>

                    <TextField
                        fullWidth
                        sx={{ mb: 2 }}
                        label="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        type="email"
                        variant="filled"
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        sx={{ mb: 2 }}
                        type="password"
                        variant="filled"
                    />

                    <LoginButton size="large" sx={{ px: 2 }}>
                        Login
                    </LoginButton>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Login;
