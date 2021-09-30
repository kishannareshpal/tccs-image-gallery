import { styled } from "@mui/material";

/**
 * The image tag, but rounded and with the photo which covers the container
 */
const RoundImage = styled("img")({
    borderRadius: 12,
    backgroundColor: "#F5F7FA",
    objectFit: "cover"
});

export default RoundImage;
