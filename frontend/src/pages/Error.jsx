import React from "react";
import { Container, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { RoundImage } from "../components";
import MemeCatPNG from "../assets/images/meme_cat.png";

const Error = ({
    title,
    description,
    statusCode,
    linkButtonPath,
    linkButtonText
}) => (
    <Container
        sx={{
            display: "flex",
            height: "100vh",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        }}
    >
        <RoundImage height={180} width={180} src={MemeCatPNG} alt="" />
        <Typography variant="h1" fontWeight={800}>
            {title}
            <Typography variant="subtitle1" component="span" fontWeight={200}>
                ({statusCode})
            </Typography>
        </Typography>
        {description && <Typography variant="h4">{description}</Typography>}
        <Button
            to={linkButtonPath}
            sx={{ mt: 2 }}
            variant="light"
            component={Link}
        >
            {linkButtonText}
        </Button>
    </Container>
);

Error.defaultProps = {
    description: null,
    linkButtonPath: "/",
    statusCode: 404,
    linkButtonText: "Return Home"
};

Error.propTypes = {
    /**
     * Page title displayed big and bold
     */
    title: PropTypes.string.isRequired,
    /**
     * The StatusCode which lead to this page
     * @default 404
     */
    statusCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * An optional short description shown underneatht the title.
     * @default null
     */
    description: PropTypes.string,
    /**
     * The link pathname, on Link Button click.
     * @default / home
     */
    linkButtonPath: PropTypes.string,
    /**
     * The text of the Link Button.
     * @default "Return Home"
     */
    linkButtonText: PropTypes.string
};

export default Error;
