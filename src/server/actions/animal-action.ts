// server/actions/found-pet-action.ts
"use server";
import axios from "@lib/axios";
import { getAuthHeaders } from "@server/helper";
import { revalidatePath } from "next/cache";
import { ApiResponse } from "interfaces";

export async function reportFoundPetAction(data: {
  animal_name: string;
  date_last_seen: string;
  image_file: File;
  nearest_location: string;
  species: string;
  breed_id: string;
}): Promise<ApiResponse<any>> {
  try {
    const endpoint = "/api/frontend/animal/report/found";

    const formData = new FormData();
    formData.append("animal_name", data.animal_name);
    formData.append("date_last_seen", data.date_last_seen);
    formData.append("image_file", data.image_file);
    formData.append("nearest_location", data.nearest_location);
    formData.append("species", data.species);
    formData.append("breed_id", data.breed_id);

    const header = {
      ...getAuthHeaders(),
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    };

    const response = await axios.post(endpoint, formData, { headers: header });

    revalidatePath("/found-pets");

    return {
      success: true,
      code: response.data.code || 200,
      title: "Success",
      message: response.data.message || "Pet reported successfully",
      result: response.data.result,
    };
  } catch (error: any) {
    console.error("Report Found Pet Error:", error.response?.data);
    return {
      success: false,
      code: error.response?.status || 500,
      title: "Report Failed",
      message: error.response?.data?.message || "Failed to report found pet",
      result: null,
      errors: error.response?.data?.errors || {},
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
