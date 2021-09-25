import React, { useState, useEffect } from "react";
import {
    Container,
    Button,
    Grid,
    Typography,
    TextField,
    Alert,
    InputAdornment,
    IconButton
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, Redirect, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useUser from "../hooks/useUser";
import NetworkServices from "../services/network.services";

/**
 * Validation schema for the user's credentials
 */
const schema = yup
    .object({
        firstName: yup
            .string()
            .min(1, "Must contain at least 1 letter")
            .max(255, "Must not contain more than 255 letter")
            .matches(/^[a-zA-Z]+$/, "Must only contain letters")
            .required()
            .label("First name"),
        lastName: yup
            .string()
            .min(1, "Must contain at least 1 character")
            .max(255, "Must not contain more than 255 chars")
            .matches(/^[a-zA-Z]+$/, "Must only contain letters")
            .required()
            .label("Last Name"),
        email: yup
            .string()
            .email("Please insert a valid email address")
            .trim()
            .nullable(false)
            .required()
            .label("Email"),
        username: yup
            .string()
            .lowercase()
            .min(3, "Username must contain at least 3 characters")
            .trim()
            .nullable(false)
            .matches(
                /^[a-z0-9]+$/,
                "Username is case insensitive and must only contain letters"
            )
            .required()
            .label("Username"),
        password: yup
            .string()
            .nullable(false)
            .min(3, "Password must contain at least 3 characters")
            .required()
            .label("Password")
    })
    .required();

const Register = () => {
    const [redirectUrl, setRedirectUrl] = useState();
    const [shouldDisableInputs, setShouldDisableInputs] = useState(false);
    const [shouldShowPassword, setShouldShowPassword] = useState(false);
    const [serverErrorMessage, setServerErrorMessage] = useState();
    const [serverErrors, setServerErrors] = useState({});
    const [serverSuccessMessage, setServerSuccessMessage] = useState();

    const history = useHistory();
    const { isAuthenticated, setUser } = useUser();

    /**
     * Form data
     */
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
        // Clear previous error messages and errors
        setServerErrorMessage(null);
        setServerErrors({});
        // Disable inputs when processing request
        setShouldDisableInputs(true);
        // Try loging in with given credentials
        try {
            const { data } = await NetworkServices.register(
                credentials.firstName,
                credentials.lastName,
                credentials.email,
                credentials.username,
                credentials.password
            );

            if (data.code === 400 || data.code === 401) {
                // Could not register
                setServerErrorMessage(data.message);
                setServerErrors(data.data || {});
                // Re-enable input for retrial
                setShouldDisableInputs(false);
            } else if (data.code === 201) {
                // Successfully registered, and logged in
                setServerSuccessMessage(
                    "You are now registered and logged in. Redirecting to home page."
                );
                setTimeout(() => {
                    setUser(data.data.user);
                    // reload this page after 3s
                    // and let useEffect redirect to the next page.
                    history.go(0);
                }, 3000);
            }
        } catch (error) {
            setServerErrorMessage(
                `${error.response.status}: Unfortunately we were unable to register you. Please try again later`
            );

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
                    <Typography variant="h4" fontWeight={800}>
                        Create an Account
                    </Typography>

                    <Typography component="div" fontWeight={400} mb={2}>
                        View and share beautiful photos for everyone to enjoy.
                    </Typography>

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

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            <Grid item xs md={6}>
                                <TextField
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    label="First name"
                                    error={
                                        !!clientErrors.firstName?.message ||
                                        !!serverErrors.first_name
                                    }
                                    disabled={shouldDisableInputs}
                                    helperText={
                                        serverErrors.first_name ||
                                        clientErrors.firstName?.message
                                    }
                                    {...register("firstName")}
                                    type="text"
                                    variant="filled"
                                />
                            </Grid>
                            <Grid item xs md={6}>
                                <TextField
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    label="Last name"
                                    error={
                                        !!clientErrors.lastName?.message ||
                                        !!serverErrors.last_name
                                    }
                                    disabled={shouldDisableInputs}
                                    helperText={
                                        serverErrors.last_name ||
                                        clientErrors.lastName?.message
                                    }
                                    {...register("lastName")}
                                    type="text"
                                    variant="filled"
                                />
                            </Grid>
                        </Grid>

                        <TextField
                            fullWidth
                            sx={{ mb: 2 }}
                            label="Username"
                            error={
                                !!clientErrors.username?.message ||
                                !!serverErrors.username
                            }
                            disabled={shouldDisableInputs}
                            helperText={
                                serverErrors.username ||
                                clientErrors.username?.message
                            }
                            {...register("username")}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment
                                        position="start"
                                        fontWeight={600}
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
                            error={
                                !!clientErrors.email?.message ||
                                !!serverErrors.email
                            }
                            disabled={shouldDisableInputs}
                            helperText={
                                serverErrors.email ||
                                clientErrors.email?.message
                            }
                            {...register("email")}
                            type="email"
                            variant="filled"
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            {...register("password")}
                            error={
                                !!clientErrors.password?.message ||
                                !!serverErrors.password
                            }
                            disabled={shouldDisableInputs}
                            helperText={
                                serverErrors.password ||
                                clientErrors.password?.message
                            }
                            sx={{ mb: 2 }}
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
                            variant="filled"
                        />

                        <Typography variant="subtitle2" sx={{ mb: 2 }}>
                            Already have an account?{" "}
                            <Link to="/login">Login</Link>
                        </Typography>

                        <Button
                            disabled={shouldDisableInputs}
                            type="submit"
                            variant="black"
                            sx={{ px: 2, py: 1 }}
                        >
                            Register
                        </Button>
                    </form>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Register;
