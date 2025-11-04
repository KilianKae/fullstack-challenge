import axios from "axios";
import { Meeting } from "../models/Meeting";

const API_BASE_URL = "http://localhost:3000/api/meetings";

type PaginatedResponse = {
  docs: Meeting[];
  totalDocs: number;
  limit: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  page: number;
  totalPages: number;
  offset: number;
  prevPage: number | null;
  nextPage: number | null;
  pagingCounter: number;
};

export const listMeetings = async (): Promise<Meeting[]> => {
  try {
    const response = await axios.get<PaginatedResponse>(
      API_BASE_URL + "?limit=100"
    );
    return response.data.docs;
  } catch (error) {
    console.error("Error fetching meetings:", error);
    throw error;
  }
};

export const createMeeting = async (meeting: Omit<Meeting, "id">) => {
  try {
    const response = await axios.post(API_BASE_URL, meeting);
    return response.data;
  } catch (error) {
    console.error("Error creating meeting:", error);
    throw error;
  }
};
