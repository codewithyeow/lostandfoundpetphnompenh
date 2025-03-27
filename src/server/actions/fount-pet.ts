// server/actions/found-pet-action.ts
"use server";
import { ApiResponse } from "interfaces";

export async function CreaterReportFoundPetAction(formData: FormData) {
  console.log("Server action called. FormData:", Object.fromEntries(formData)); // Log the form data

  try {
    console.log("Server action reached the try block"); // check if the try block is reached.
    return {
      success: true,
      message: "Test response",
      errors: [],
    };
  } catch (error) {
    console.error("Server action error:", error);
    return {
      success: false,
      message: "Test error",
      errors: [],
    };
  } finally {
    console.log("Server action finished"); // log the end of the action.
  }
}