"use client";

import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

export default function DeleteGroupDialog({
  title = "",
  subs = "",
  open,
  onClose,
  onConfirm,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 0,
          width: 400,
          p: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "16px",
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", pb: 1 }}>
        <Typography variant="body2" color="text.primary">
          {subs}
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          pb: 1,
        }}
      >
        <Button
          variant="outlined"
          sx={{
            width: 100,
            color: "black",
            borderColor: "black",
            backgroundColor: "white",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#f5f5f5",
              borderColor: "black",
            },
          }}
          onClick={onConfirm}
        >
          삭제
        </Button>

        <Button
          variant="outlined"
          sx={{
            width: 100,
            color: "black",
            borderColor: "black",
            backgroundColor: "white",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#f5f5f5",
              borderColor: "black",
            },
          }}
          onClick={onClose}
        >
          취소
        </Button>
      </DialogActions>
    </Dialog>
  );
}
