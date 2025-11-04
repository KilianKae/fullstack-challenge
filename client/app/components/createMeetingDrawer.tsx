"use client";

import { Box, Button, Drawer, TextField, Typography } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import React, { useState } from "react";
import { Meeting } from "../models/Meeting";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (meeting: Omit<Meeting, "id">) => Promise<void>;
};

export default function CreateMeetingModal({ open, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!startTime) {
      newErrors.startTime = "Start time is required";
    }

    if (!endTime) {
      newErrors.endTime = "End time is required";
    }

    if (startTime && endTime && endTime <= startTime) {
      newErrors.endTime = "End time must be after start time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        startTime: startTime!.toISOString(),
        endTime: endTime!.toISOString(),
      });
      handleClose();
    } catch (error) {
      console.error("Error creating meeting:", error);
      setErrors({
        submit: "Failed to create meeting. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle("");
      setStartTime(null);
      setEndTime(null);
      setDescription("");
      setErrors({});
      onClose();
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleClose}>
      <Box
        sx={{
          width: 400,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Header */}
        <Box sx={{ padding: "24px" }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, fontSize: "20px", paddingBottom: "8px" }}
          >
            Create a new meeting
          </Typography>
          <Typography variant="body1">
            Complete the information below in order to create a new meeting.
          </Typography>
        </Box>

        {/* Content */}
        <Box
          sx={{
            flex: 1,
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            overflowY: "auto",
          }}
        >
          <TextField
            label="Meeting title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            required
            fullWidth
            autoFocus
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 'auto',
                minHeight: '48px',
              },
            }}
          />

          <DateTimePicker
            label="Start Time"
            value={startTime}
            onChange={(newValue) => setStartTime(newValue)}
            slotProps={{
              textField: {
                required: true,
                error: !!errors.startTime,
                helperText: errors.startTime,
                fullWidth: true,
              },
            }}
          />

          <DateTimePicker
            label="End Time"
            value={endTime}
            onChange={(newValue) => setEndTime(newValue)}
            slotProps={{
              textField: {
                required: true,
                error: !!errors.endTime,
                helperText: errors.endTime,
                fullWidth: true,
              },
            }}
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
            fullWidth
            placeholder="Optional"
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 'auto',
                padding: '12px',
              },
            }}
          />

          {errors.submit && (
            <div style={{ color: "#d32f2f", fontSize: "0.75rem" }}>
              {errors.submit}
            </div>
          )}
        </Box>

        {/* Actions */}
        <Box
          sx={{
            padding: "16px 24px",
            borderTop: "1px solid #E7E8E9",
            display: "flex",
            gap: "8px",
          }}
        >
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={isSubmitting}
            sx={{ flex: 1 }}
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isSubmitting}
            sx={{ flex: 1 }}
          >
            {isSubmitting ? "Creating..." : "Save"}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
