import { AppBar, Button, Toolbar } from "@mui/material";
import { useState } from "react";
import { Meeting } from "../models/Meeting";
import CreateMeetingModal from "./createMeetingDrawer";

type Props = {
  onCreateMeeting: (meeting: Omit<Meeting, "id">) => Promise<void>;
};
export default function Header({ onCreateMeeting }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const handleCreateMeeting = async (meeting: Omit<Meeting, "id">) => {
    try {
      await onCreateMeeting(meeting);
      setModalOpen(false);
    } catch (error) {
      console.error("Error creating meeting:", error);
      throw error;
    }
  };
  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img src="/bliro_logo.svg" alt="Bliro Logo" style={{ height: 24 }} />
        <Button
          variant="contained"
          onClick={() => setModalOpen(true)}
          sx={{
            height: "40px",
            paddingLeft: "16px",
            paddingRight: "16px",
            borderRadius: "4px",
            gap: "8px",
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 600,
          }}
          startIcon={
            <img
              src="/arrow-up-right-square.svg"
              alt=""
              style={{
                width: "20px",
                height: "20px",
                filter: "brightness(0) invert(1)",
              }}
            />
          }
        >
          Create Meeting
        </Button>
      </Toolbar>
      <CreateMeetingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateMeeting}
      />
    </AppBar>
  );
}
