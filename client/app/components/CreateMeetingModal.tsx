"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import React, { useState } from "react";
import { Meeting } from "../models/Meeting";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (meeting: Omit<Meeting, "id">) => Promise<void>;
};

export default function CreateMeetingModal({
  open,
  onClose,
  onSubmit,
}: Props) {
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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Meeting</DialogTitle>
      <DialogContent>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingTop: "8px" }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            required
            fullWidth
            autoFocus
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
            rows={3}
            fullWidth
            placeholder="Optional"
          />

          {errors.submit && (
            <div style={{ color: "#d32f2f", fontSize: "0.75rem" }}>
              {errors.submit}
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions sx={{ padding: "16px 24px" }}>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Meeting"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
