// server/actions/found-pet-action.ts
"use server";
import axios from "@lib/axios";
import { getAuthHeaders } from "@server/helper";
import { get } from "http";
import { ApiResponse } from "interfaces";

interface MyPet {
  location: string;
  id: number;
  name_en: string;
  name_kh: string | null;
  image: string;
  species: number;
  size: number;
  breed_id: number;
  desc: string | null;
  animal_status: number; // 1 = Active, 2 = Reunited (assuming based on context)
  report_date: string; // e.g., "2025-03-29 09:30:38"
  report_status: number;
  report_type: number; // 1 = Lost, 2 = Found (assuming based on context)
}

interface EditReportLostParams{
    report_id: string;
    report_type: string; // "1" for Lost, "2" for Found
    animal_name: string;
    breed_id: string;
    species: string;
    sex: string;
    size: string;
    distinguishing_features: string;
    date_lost: string; // Format: "MM/DD/YYYY"
    nearest_address_last_seen: string;
    additional_details: string;
    owner_name: string;
    contact_email: string;
    phone_number: string;
    reward: string;
  }
  interface EditReportLostResponse extends ApiResponse<null> {}
interface MyPetsApiResponse extends ApiResponse<MyPet[]> {}

export async function CreaterReportFoundPetAction(formData: FormData) {
  console.log("CreaterReportFoundPetAction started");

  // Log all form data entries
  for (const [key, value] of Array.from(formData.entries())) {
    console.log(
      `FormData Entry - Key: ${key}, Value:`,
      value instanceof File ? `File: ${value.name}` : value
    );
  }

  try {
    // Detailed field validation
    const requiredFields = [
      "species",
      "breed_id",
      "your_name",
      "contact_email",
      "phone_number",
    ];

    for (const field of requiredFields) {
      const fieldValue = formData.get(field);
      console.log(`Checking field ${field}:`, fieldValue);

      if (!fieldValue) {
        console.error(`Missing required field: ${field}`);
        return {
          success: false,
          message: `Missing required field: ${field}`,
        };
      }
    }

    // More robust error handling
    const response = await axios.post(
      `/api/frontend/animal/report/found`,
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        timeout: 10000, // 10 seconds timeout
      }
    );

    return response.data;
  } catch (error: any) {
    // More comprehensive error logging
    console.error("Full Error Object:", error);

    if (error.response) {
      // The request was made and the server responded with a status code
      console.error("Response Error Data:", error.response.data);
      console.error("Response Error Status:", error.response.status);
      console.error("Response Error Headers:", error.response.headers);

      return {
        success: false,
        message:
          error.response.data?.message || "Server responded with an error",
        errors: error.response.data?.errors || [],
      };
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      return {
        success: false,
        title: "No Response",
        code: 500,
        message: "No response from server",
        errors: {},
      };
    } else {
      // Something happened in setting up the request
      console.error("Error setting up request:", error.message);
      return {
        success: false,
        title: "Error",
        code: 500,
        message: error.message || "Unexpected error occurred",
        errors: {},
      };
    }
  } finally {
    console.log("CreaterReportFoundPetAction finished");
  }
}

export async function CreaterReportLostPetAction(formData: FormData) {
  for (const [key, value] of Array.from(formData.entries())) {
    console.log(
      `FormData Entry - Key: ${key}, Value:`,
      value instanceof File ? `File: ${value.name}` : value
    );
  }

  try {
    // Detailed field validation
    const requiredFields = [
      "species",
      "breed_id",
      "owner_name",
      "contact_email",
      "phone_number",
    ];

    for (const field of requiredFields) {
      const fieldValue = formData.get(field);
      console.log(`Checking field ${field}:`, fieldValue);

      if (!fieldValue) {
        console.error(`Missing required field: ${field}`);
        return {
          success: false,
          message: `Missing required field: ${field}`,
        };
      }
    }
    // More robust error handling
    const response = await axios.post(
      `/api/frontend/animal/report/lost`,
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        timeout: 10000, // 10 seconds timeout
      }
    );

    return response.data;
  } catch (error: any) {
    // More comprehensive error logging
    console.error("Full Error Object:", error);

    if (error.response) {
      // The request was made and the server responded with a status code
      console.error("Response Error Data:", error.response.data);
      console.error("Response Error Status:", error.response.status);
      console.error("Response Error Headers:", error.response.headers);

      return {
        success: false,
        message:
          error.response.data?.message || "Server responded with an error",
        errors: error.response.data?.errors || [],
      };
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      return {
        success: false,
        title: "No Response",
        code: 500,
        message: "No response from server",
        errors: {},
      };
    } else {
      // Something happened in setting up the request
      console.error("Error setting up request:", error.message);
      return {
        success: false,
        title: "Error",
        code: 500,
        message: error.message || "Unexpected error occurred",
        errors: {},
      };
    }
  } finally {
    console.log("CreatReportLostPetAction finished");
  }
}

// Fetch all pets (lost and found) for the authenticated user
export async function fetchMyPet(): Promise<MyPetsApiResponse> {
  try {
    const response = await axios.get(`/api/frontend/animal/my-pets`, {
      headers: {
        ...getAuthHeaders(), // Include authentication token
        Accept: "application/json",
      },
      timeout: 10000, // 10 seconds timeout
    });

    return response.data as MyPetsApiResponse;
  } catch (error: any) {
    console.error("Error fetching my pets:", error);
    if (error.response) {
      console.error("Response Error Data:", error.response.data);
      console.error("Response Error Status:", error.response.status);
      console.error("Response Error Headers:", error.response.headers);
      return {
        success: false,
        title: "Error Fetching Pets",
        code: error.response.status || 500,
        message: error.response.data?.message || "Failed to fetch pets",
        errors: error.response.data?.errors || [],
        result: [],
      };
    } else if (error.request) {
      console.error("No response received:", error.request);
      return {
        success: false,
        title: "No Response",
        code: 500,
        message: "No response from server",
        errors: error.response.data?.errors || [],
        result: [],
      };
    } else {
      console.error("Error setting up request:", error.message);
      return {
        success: false,
        title: "Error",
        code: 500,
        message: error.message || "Unexpected error occurred",
        errors: error.response.data?.errors || [],
        result: [],
      };
    }
  }
}

export async function fetchAllReport(): Promise<MyPetsApiResponse> {
  try {
    const response = await axios.get(
      `/api/frontend/animal/get-latest-reports`,
      {
        headers: {
          ...getAuthHeaders(),
          Accept: "application/json",
        },
        timeout: 10000, // 10 seconds timeout
      }
    );

    return response.data as MyPetsApiResponse;
  } catch (error: any) {
    console.error("Error fetching all pets:", error);
    if (error.response) {
      console.error("Response Error Data:", error.response.data);
      console.error("Response Error Status:", error.response.status);
      console.error("Response Error Headers:", error.response.headers);
      return {
        success: false,
        title: "Error Fetching Pets",
        code: error.response.status || 500,
        message: error.response.data?.message || "Failed to fetch pets",
        errors: error.response.data?.errors || [],
        result: [],
      };
    } else if (error.request) {
      console.error("No response received:", error.request);
      return {
        success: false,
        title: "No Response",
        code: 500,
        message: "No response from server",
        errors: error.response.data?.errors || [],
        result: [],
      };
    } else {
      console.error("Error setting up request:", error.message);
      return {
        success: false,
        title: "Error",
        code: 500,
        message: error.message || "Unexpected error occurred",
        errors: error.response.data?.errors || [],
        result: [],
      };
    }
  }
}

// edit report found pet
export async function editReportLostPet(params: EditReportLostParams): Promise<EditReportLostResponse> {
  console.log("editReportlostPet started with params:", params);

  try {
    // Validate required fields
    const requiredFields: (keyof EditReportLostParams)[] = [
      "report_id",
      "report_type",
      "animal_name",
      "breed_id",
      "species",
      "sex",
      "size",
      "owner_name",
      "contact_email",
      "phone_number",
    ];

    for (const field of requiredFields) {
      if (!params[field] || params[field].trim() === "") {
        console.error(`Missing or empty required field: ${field}`);
        return {
          success: false,
          title: "Validation Error",
          code: 400,
          message: `Missing or empty required field: ${field}`,
          errors: {},
        };
      }
    }

    // Additional validation for specific fields
    if (!["1", "2"].includes(params.report_type)) {
      console.error("Invalid report_type, must be '1' (Lost) or '2' (Found)");
      return {
        success: false,
        title: "Validation Error",
        code: 400,
        message: "Invalid report_type, must be '1' (Lost) or '2' (Found)",
        errors: {},
      };
    }

    // Validate date_lost format (MM/DD/YYYY)
    const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    if (params.date_lost && !dateRegex.test(params.date_lost)) {
      console.error("Invalid date_lost format, expected MM/DD/YYYY");
      return {
        success: false,
        title: "Validation Error",
        code: 400,
        message: "Invalid date_lost format, expected MM/DD/YYYY",
        errors: {},
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(params.contact_email)) {
      console.error("Invalid contact_email format");
      return {
        success: false,
        title: "Validation Error",
        code: 400,
        message: "Invalid contact_email format",
        errors: {},
      };
    }

    // Send the PUT request with raw JSON body
    const response = await axios.put(
      `/api/frontend/animal/report/edit`,
      params, // Raw JSON body
      {
        headers: {
          ...getAuthHeaders(),
          Accept: "application/json",
          "Content-Type": "application/json", // For raw JSON
        },
        timeout: 10000, // 10 seconds timeout
      }
    );

    console.log("editReportPet response:", response.data);
    return response.data as EditReportLostResponse;
  } catch (error: any) {
    console.error("Full Error Object in editReportPet:", error);

    if (error.response) {
      // The request was made and the server responded with a status code
      console.error("Response Error Data:", error.response.data);
      console.error("Response Error Status:", error.response.status);
      console.error("Response Error Headers:", error.response.headers);

      return {
        success: false,
        title: "Error",
        code: error.response.status || 500,
        message: error.response.data?.message || "Server responded with an error",
        errors: error.response.data?.errors || [],
      };
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      return {
        success: false,
        title: "No Response",
        code: 500,
        message: "No response from server",
        errors: {},
      };
    } else {
      // Something happened in setting up the request
      console.error("Error setting up request:", error.message);
      return {
        success: false,
        title: "Error",
        code: 500,
        message: error.message || "Unexpected error occurred",
        errors: {},
      };
    }
  } finally {
    console.log("editReportPet finished");
  }
}
export async function getCondition(): Promise<
  ApiResponse<Record<string, string>>
> {
  try {
    const { data }: { data: ApiResponse<Record<string, string>> } =
      await axios.get("/api/frontend/animal/get-conditions", {
        headers: getAuthHeaders(),
      });
    return {
      success: true,
      title: data.title || "OK",
      code: data.code || 200,
      message: data.message || "Condition retrieved successfully",
      result: data.result || {},
    };
  } catch (error: any) {
    console.error("Error fetching Condition:", error.response?.data);

    return {
      success: false,
      title: "Failed to Fetch Condition",
      code: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        "Failed to retrieve Condition. Please try again.",
      result: {},
    };
  }
}
export async function getSpecies(): Promise<
  ApiResponse<Record<string, string>>
> {
  try {
    const { data }: { data: ApiResponse<Record<string, string>> } =
      await axios.get("/api/frontend/animal/get-species", {
        headers: getAuthHeaders(),
      });

    return {
      success: true,
      title: data.title || "OK",
      code: data.code || 200,
      message: data.message || "Species retrieved successfully",
      result: data.result || {},
    };
  } catch (error: any) {
    console.error("Error fetching species:", error.response?.data);

    return {
      success: false,
      title: "Failed to Fetch Species",
      code: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        "Failed to retrieve species. Please try again.",
      result: {},
    };
  }
}

export async function getBreedsBySpecies(
  speciesId: string
): Promise<ApiResponse<any>> {
  try {
    const { data }: { data: ApiResponse<any> } = await axios.get(
      `/api/frontend/animal/get-breeds-by-species?species=${speciesId}`,
      {
        headers: getAuthHeaders(),
      }
    );

    return {
      success: true,
      title: data.title || "OK",
      code: data.code || 200,
      message: data.message || "Breeds retrieved successfully",
      result: data.result || [],
    };
  } catch (error: any) {
    console.error("Error fetching breeds:", error.response?.data);

    return {
      success: false,
      title: "Failed to Fetch Breeds",
      code: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        "Failed to retrieve breeds. Please try again.",
      result: [],
    };
  }
}

export async function getSize(): Promise<ApiResponse<Record<string, string>>> {
  try {
    const { data }: { data: ApiResponse<Record<string, string>> } =
      await axios.get(`/api/frontend/animal/get-sizes`, {
        headers: getAuthHeaders(),
      });
    return {
      success: true,
      title: data.title || "OK",
      code: data.code || 200,
      message: data.message || "Size retrieved successfully",
      result: data.result || {},
    };
  } catch (error: any) {
    console.error("Error fetching size:", error.response?.data);

    return {
      success: false,
      title: "Failed to Fetch size",
      code: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        "Failed to retrieve size. Please try again.",
      result: {},
    };
  }
}
