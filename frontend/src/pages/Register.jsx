import React, { useState } from "react";
import {
    Container,
    Button,
    Grid,
    Typography,
    TextField,
    InputAdornment,
    IconButton
} from "@mui/material";
import { Link } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Register = () => {
    /**
     * User's registration details
     */
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
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
                        Create an Account
                    </Typography>

                    <Typography component="div" sx={{ fontWeight: 400, mb: 2 }}>
                        View and share beautiful photos for everyone to enjoy.
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs md={6}>
                            <TextField
                                fullWidth
                                sx={{ mb: 2 }}
                                label="First name"
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                type="email"
                                variant="filled"
                            />
                        </Grid>
                        <Grid item xs md={6}>
                            <TextField
                                fullWidth
                                sx={{ mb: 2 }}
                                label="Last name"
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                type="email"
                                variant="filled"
                            />
                        </Grid>
                    </Grid>

                    <TextField
                        fullWidth
                        sx={{ mb: 2 }}
                        label="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment
                                    position="start"
                                    sx={{ fontWeight: "600" }}
                                >
                                    @
                                </InputAdornment>
                            )
                        }}
                        type="text"
                        variant="filled"
                    />

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
                        Already have an account? <Link to="/login">Login</Link>
                    </Typography>

                    <Button variant="black" sx={{ px: 2, py: 1 }}>
                        Register
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Register;
