import React, { useState, useEffect } from "react";
import {
    Container,
    Button,
    Grid,
    Typography,
    Alert,
    TextField,
    IconButton,
    InputAdornment
} from "@mui/material";
import { Link, Redirect, useHistory } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useUser from "../hooks/useUser";
import NetworkServices from "../services/network.services";

/**
 * Validation schema for login credentials
 */
const schema = yup
    .object({
        emailUsername: yup.string().required().label("Email/Username"),
        password: yup.string().required().label("Password")
    })
    .required();

const Login = () => {
    /**
     * User's auth details
     */
    const [redirectUrl, setRedirectUrl] = useState();
    const [shouldDisableInputs, setShouldDisableInputs] = useState(false);
    const [shouldShowPassword, setShouldShowPassword] = useState(false);
    const [serverErrorMessage, setServerErrorMessage] = useState();
    const [serverSuccessMessage, setServerSuccessMessage] = useState();

    const history = useHistory();
    const { user, isAuthenticated, setUser } = useUser();

    const {
        register,
        handleSubmit,
        formState: { errors: clientErrors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        // Check whether the current user is authenticated
        if (isAuthenticated) {
            // redirect to home page
            setRedirectUrl("/");
        }
    }, [isAuthenticated]);

    const onSubmit = async credentials => {
        // Clear previous error messages
        setServerErrorMessage(null);
        // Disable inputs when processing request
        setShouldDisableInputs(true);
        // Try loging in with given credentials
        try {
            const { data } = await NetworkServices.login(
                credentials.emailUsername,
                credentials.password
            );

            console.log(data);
            if (data.status === "client_error") {
                // Could not login, due to incorrect credentials
                setServerErrorMessage(data.message);
                // Re-enable input for retrial
                setShouldDisableInputs(false);
            } else if (data.status === "success") {
                setUser(data.data.user);
                setServerSuccessMessage(
                    "You are now logged in and will soon be redirected."
                );
                setTimeout(() => {
                    // reload this page after 3s
                    // and let useEffect redirect to the next page.
                    history.go(0);
                }, 3000);
            }
        } catch (error) {
            console.log("got err", error);

            // Re-enable inputs for retrial
            setShouldDisableInputs(false);
        }
    };

    if (redirectUrl) {
        return <Redirect to={redirectUrl} />;
    }
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

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {serverErrorMessage && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {serverErrorMessage}
                            </Alert>
                        )}

                        {serverSuccessMessage && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                {serverSuccessMessage}
                            </Alert>
                        )}

                        <TextField
                            fullWidth
                            {...register("emailUsername", { required: true })}
                            error={
                                !!clientErrors.emailUsername?.message ||
                                !!serverErrorMessage
                            }
                            disabled={shouldDisableInputs}
                            helperText={clientErrors.emailUsername?.message}
                            sx={{ mb: 2 }}
                            label="Email or username"
                            variant="filled"
                            type="text"
                        />

                        <TextField
                            fullWidth
                            {...register("password", { required: true })}
                            error={
                                !!clientErrors.password?.message ||
                                !!serverErrorMessage
                            }
                            disabled={shouldDisableInputs}
                            helperText={clientErrors.password?.message}
                            sx={{ mb: 2 }}
                            label="Password"
                            variant="filled"
                            type={shouldShowPassword ? "text" : "password"}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() =>
                                                setShouldShowPassword(
                                                    prev => !prev
                                                )
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
                        />

                        <Typography variant="subtitle2" sx={{ mb: 2 }}>
                            Don&apos;t have an account?{" "}
                            <Link to="/register">Create Account</Link>
                        </Typography>

                        <Button
                            disabled={shouldDisableInputs}
                            variant="black"
                            type="submit"
                            sx={{ px: 2, py: 1 }}
                        >
                            Login
                        </Button>
                    </form>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Login;
