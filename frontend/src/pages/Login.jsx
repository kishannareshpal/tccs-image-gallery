import React, { useState } from "react";
import { Container, Button, Grid, Typography, TextField } from "@mui/material";

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

                    <Button variant="black" sx={{ px: 2 }}>
                        Login
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Login;
