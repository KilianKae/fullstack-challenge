import meetingService from "../services/meetingService";
import { createMeetingSchema } from "../validators/meeting";

const listMeetings = async (req: any, res: any) => {
  try {
    const meetings = await meetingService.listMeetings(req.query);
    res.json(meetings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const createMeeting = async (req: any, res: any) => {
  try {
    const validatedMeetingResult = await createMeetingSchema.safeParseAsync(
      req.body
    );

    if (!validatedMeetingResult.success) {
      const errors = validatedMeetingResult.error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return res.status(400).json({
        message: "Invalid meeting data",
        errors
      });
    }
    const validatedMeeting = validatedMeetingResult.data;
    const meeting = await meetingService.createMeeting(validatedMeeting);
    res.status(201).json(meeting);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export default { listMeetings, createMeeting };
