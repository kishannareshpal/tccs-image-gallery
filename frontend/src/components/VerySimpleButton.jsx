import { styled } from "@mui/material";

const VerySimpleButton = styled("button")({
    background: "none",
    outline: "none",
    padding: 0,
    fontWeight: 600,
    border: "none",
    color: "#000",
    cursor: "pointer",
    textDecoration: "underline",

    "&:hover": {
        color: "#747474"
    }
});

export default VerySimpleButton;
