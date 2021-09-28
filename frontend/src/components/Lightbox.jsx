import React from "react";
import {
    Box,
    Grid,
    Modal as MuiModal,
    IconButton,
    styled
} from "@mui/material";
import { Close } from "@mui/icons-material";
import PropTypes from "prop-types";
import RoundImage from "./RoundImage";

/**
 * Customized Modal, ModalContent and ModalActions for the Lightbox
 */
const ImagePreviewModal = styled(MuiModal)({
    "& .MuiBackdrop-root": {
        backgroundColor: "rgba(255, 255, 255, 0.838)"
    }
});

const ImagePreviewModalContent = styled(Grid)({
    width: "100%",
    height: "100%",
    outline: "none"
});

const ImagePreviewModalActions = styled(Box)({
    position: "fixed",
    top: 0,
    left: 0,
    padding: "20px",
    display: "flex",
    alignItems: "flex-start"
});

/**
 * LightBox, which allows previewing images.
 */
const Lightbox = ({ photoURL, onClose, open }) => (
    <ImagePreviewModal onClose={onClose} open={open}>
        <ImagePreviewModalContent container onClick={onClose}>
            <RoundImage
                sx={{ objectFit: "contain", cursor: "zoom-out" }}
                width="100%"
                height="100%"
                src={photoURL}
                alt="Preview"
            />

            <ImagePreviewModalActions>
                <IconButton
                    onClick={onClose}
                    sx={{
                        background: "black",
                        color: "white",
                        "&:hover": {
                            background: "#292929"
                        }
                    }}
                >
                    <Close />
                </IconButton>
            </ImagePreviewModalActions>
        </ImagePreviewModalContent>
    </ImagePreviewModal>
);

Lightbox.propTypes = {
    /**
     * The URL of the photo being previewed
     */
    photoURL: PropTypes.string.isRequired,
    /**
     * Controls whether the lightbox should be open or not
     */
    open: PropTypes.bool.isRequired,
    /**
     * Handle lightbox close
     */
    onClose: PropTypes.func.isRequired
};

export default Lightbox;
