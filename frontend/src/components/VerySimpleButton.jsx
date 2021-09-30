import { styled } from "@mui/material";

const VerySimpleButton = styled("button", {
    shouldForwardProp: prop => prop !== "confirming"
})(({ confirming }) => ({
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
    },

    "&:disabled": {
        color: "#949494"
    },

    ...(confirming && {
        color: "#DD1C1A",
        "&:hover": {
            color: "#e74340"
        }
    })
}));

export default VerySimpleButton;
