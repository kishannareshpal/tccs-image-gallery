import React, { useState } from "react";
import {
    Container,
    Button,
    Grid,
    Typography,
    TextField,
    IconButton,
    InputAdornment
} from "@mui/material";
import { Link } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
    /**
     * User's auth details
     */
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [shouldShowPassword, setShouldShowPassword] = useState(false);

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
                        label="Email or username"
                        value={emailOrUsername}
                        onChange={e => setEmailOrUsername(e.target.value)}
                        type="email"
                        variant="filled"
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        sx={{ mb: 2 }}
                        type={shouldShowPassword ? "text" : "password"}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() =>
                                            setShouldShowPassword(prev => !prev)
                                        }
                                    >
                                        {shouldShowPassword ? (
                                            <Visibility />
                                        ) : (
                                            <VisibilityOff />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        variant="filled"
                    />

                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                        Don&apos;t have an account?{" "}
                        <Link to="/register">Create Account</Link>
                    </Typography>

                    <Button variant="black" sx={{ px: 2, py: 1 }}>
                        Login
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Login;