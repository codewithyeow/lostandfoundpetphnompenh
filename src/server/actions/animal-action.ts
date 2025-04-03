// server/actions/found-pet-action.ts
"use server";
import axios from "@lib/axios";
import { Data } from "@react-google-maps/api";
import { getAuthHeaders } from "@server/helper";
import { get } from "http";
import { ApiResponse } from "interfaces";

export interface EditReportPetParams {
  report_id: string;
  report_type: string; // "1" for Lost, "2" for Found
  animal_name: string;
  breed_id: string;
  species: string;
  sex: string;
  size: string;
  distinguishing_features: string;
  date_lost?: string; // Required for Lost
  nearest_address_last_seen?: string; // Required for Lost
  date_found?: string; // Required for Found
  where_pet_was_found?: string; // Required for Found
  condition?: string; // Required for Found
  additional_location_details: string;
  owner_name: string;
  contact_email: string;
  phone_number: string;
  reward: string;
}

interface EditReportPetResponse extends ApiResponse<null> {}
export interface EditReportLostParams {
  report_id: string;
  report_type: string;
  animal_name: string;
  breed_id: string;
  species: string;
  sex: string;
  size: string;
  distinguishing_features: string;
  date_lost: string;
  nearest_address_last_seen: string;
  additional_location_details: string;
  owner_name: string;
  contact_email: string;
  phone_number: string;
  reward: string;
}

// Existing fetchMyPet (unchanged, included for context)
export interface MyPet {
  pivot: any;
  status: number;
  finder_name: string;
  animal_info: string;
  condition: string;
  date_found: string;
  location: string;
  report_id: string;
  id: number;
  name_en: string;
  name_kh: string | null;
  image: string;
  species: number;
  size: number;
  breed_id: number;
  where_pet_was_found: string;
  desc: string | null;
  animal_status: number;
  report_date: string;
  report_status: number;
  report_type: number;
  reward: string;
  sex: string;
  distinguishing_features: string;
  date_lost: string;
  nearest_address_last_seen: string;
  additional_details: string;
  owner_name: string;
  contact_email: string;
  phone_number: string;
  animal_id: string;
}

interface MyPetsApiResponse extends ApiResponse<MyPet[]> {}

export async function search(params: { species?: number; breed_id?: number; size?: number }) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/search`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch search results: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error in search function:", error);
    throw error;
  }
}



//New function to mark a pet as reunited
export async function updateMarkReunitedStatus(
  animal_id: number
): Promise<ApiResponse<null>> {
  try {
    const response = await axios.put(
      `/api/frontend/animal/mark-reunited?animal_id=${animal_id}`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
    return {
      success: true,
      title: "Success",
      code: 200,
      message: "Pet marked as reunited successfully",
      result: null,
    };
  } catch (error) {
    console.error("Error marking pet as reunited:", error);
    return {
      success: false,
      title: "Error",
      code: 500,
      message: "Failed to mark pet as reunited",
    };
  }
}

export async function updateMarkActiveStatus(
  animal_id: number
): Promise<ApiResponse<null>> {
  try {
    const response = await axios.put(
      `/api/frontend/animal/mark-active?animal_id=${animal_id}`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
    return {
      success: true,
      title: "Success",
      code: 200,
      message: "Pet marked as return back to active successfully",
      result: null,
    };
  } catch (error) {
    console.error("Error marking pet as active:", error);
    return {
      success: false,
      title: "Error",
      code: 500,
      message: "Failed to mark pet as active",
    };
  }
}
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

// Fetch My Favorite
export async function fetchMyFavorite(): Promise<MyPetsApiResponse> {
  try {
    const response = await axios.get(`/api/frontend/animal/get-favorites`, {
      headers: {
        ...getAuthHeaders(),
        Accept: "application/json",
      },
      timeout: 10000,
    });
    console.log("reponse api", response);

    return response.data as MyPetsApiResponse;
  } catch (error: any) {
    console.error("Error fetching my favorite:", error);
    if (error.response) {
      console.error("Response Error Data:", error.response.data);
      console.error("Response Error Status:", error.response.status);
      console.error("Response Error Headers:", error.response.headers);
      return {
        success: false,
        title: "Error Fetching Favorite",
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

// Add to Favorite
export async function addToFavorite(
  animalInfoId: number
): Promise<MyPetsApiResponse> {
  try {
    const response = await axios.post(
      `/api/frontend/animal/add-to-favorite?animal_info_id=${animalInfoId}`,
      {},
      {
        headers: {
          ...getAuthHeaders(),
          Accept: "application/json",
        },
        timeout: 10000,
      }
    );

    return response.data as MyPetsApiResponse;
  } catch (error: any) {
    console.error("Error adding to favorite:", error);
    if (error.response) {
      console.error("Response Error Data:", error.response.data);
      console.error("Response Error Status:", error.response.status);
      console.error("Response Error Headers:", error.response.headers);
      return {
        success: false,
        title: "Error Adding to Favorite",
        code: error.response.status || 500,
        message:
          error.response.data?.message || "Failed to add pet to favorites",
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

export async function removeFromFavorite(
  animalInfoId: number
): Promise<MyPetsApiResponse> {
  try {
    const response = await axios.delete(
      `/api/frontend/animal/remove-from-favorite?animal_info_id=${animalInfoId}`,
      {
        headers: {
          ...getAuthHeaders(),
          Accept: "application/json",
        },
        timeout: 10000,
      }
    );

    return response.data as MyPetsApiResponse;
  } catch (error: any) {
    console.error("Error removing from favorite:", error);
    if (error.response) {
      console.error("Response Error Data:", error.response.data);
      console.error("Response Error Status:", error.response.status);
      console.error("Response Error Headers:", error.response.headers);
      return {
        success: false,
        title: "Error Removing from Favorite",
        code: error.response.status || 500,
        message:
          error.response.data?.message || "Failed to remove pet from favorites",
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

// Unified edit function for both Lost and Found reports
export async function editReportPet(
  params: EditReportPetParams
): Promise<EditReportPetResponse> {
  console.log("editReportPet started with params:", params);

  try {
    // Common required fields for both Lost and Found
    const commonRequiredFields: (keyof EditReportPetParams)[] = [
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
    // Validate report_type
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

    // Date format regex (MM/DD/YYYY)
    const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

    // Type-specific validation
    if (params.report_type === "1") {
      // Lost report validation
      if (!params.date_lost || !dateRegex.test(params.date_lost)) {
        console.error("Invalid or missing date_lost, expected MM/DD/YYYY");
        return {
          success: false,
          title: "Validation Error",
          code: 400,
          message: "Invalid or missing date_lost, expected MM/DD/YYYY",
          errors: {},
        };
      }
      if (
        !params.nearest_address_last_seen ||
        params.nearest_address_last_seen.trim() === ""
      ) {
        console.error("Missing or empty nearest_address_last_seen");
        return {
          success: false,
          title: "Validation Error",
          code: 400,
          message: "Missing or empty nearest_address_last_seen",
          errors: {},
        };
      }
    } else if (params.report_type === "2") {
      // Found report validation
      if (!params.date_found || !dateRegex.test(params.date_found)) {
        console.error("Invalid or missing date_found, expected MM/DD/YYYY");
        return {
          success: false,
          title: "Validation Error",
          code: 400,
          message: "Invalid or missing date_found, expected MM/DD/YYYY",
          errors: {},
        };
      }
      if (
        !params.where_pet_was_found ||
        params.where_pet_was_found.trim() === ""
      ) {
        console.error("Missing or empty where_pet_was_found");
        return {
          success: false,
          title: "Validation Error",
          code: 400,
          message: "Missing or empty where_pet_was_found",
          errors: {},
        };
      }
      if (!params.condition || params.condition.trim() === "") {
        console.error("Missing or empty condition");
        return {
          success: false,
          title: "Validation Error",
          code: 400,
          message: "Missing or empty condition",
          errors: {},
        };
      }
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
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 seconds timeout
      }
    );

    console.log("editReportPet response:", response.data);
    return response.data as EditReportPetResponse;
  } catch (error: any) {
    console.error("Full Error Object in editReportPet:", error);

    if (error.response) {
      console.error("Response Error Data:", error.response.data);
      console.error("Response Error Status:", error.response.status);
      console.error("Response Error Headers:", error.response.headers);

      return {
        success: false,
        title: "Error",
        code: error.response.status || 500,
        message:
          error.response.data?.message || "Server responded with an error",
        errors: error.response.data?.errors || {},
      };
    } else if (error.request) {
      console.error("No response received:", error.request);
      return {
        success: false,
        title: "No Response",
        code: 500,
        message: "No response from server",
        errors: {},
      };
    } else {
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
