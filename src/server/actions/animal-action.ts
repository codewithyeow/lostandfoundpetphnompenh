// server/actions/found-pet-action.ts
"use server";
import axios from "@lib/axios";
import { getAuthHeaders } from "@server/helper";
import { ApiResponse } from "interfaces";

export async function CreaterReportFoundPetAction(formData: FormData) {
  console.log('CreaterReportFoundPetAction started');
  
  // Log all form data entries
  for (const [key, value] of Array.from(formData.entries())) {
    console.log(`FormData Entry - Key: ${key}, Value:`, 
      value instanceof File ? `File: ${value.name}` : value
    );
  }

  try {
    // Detailed field validation
    const requiredFields = [
      'species', 'breed_id', 'your_name',
      'contact_email', 'phone_number'
    ];
    
    for (const field of requiredFields) {
      const fieldValue = formData.get(field);
      console.log(`Checking field ${field}:`, fieldValue);
      
      if (!fieldValue) {
        console.error(`Missing required field: ${field}`);
        return {
          success: false,
          message: `Missing required field: ${field}`
        };
      }
    }

    // More robust error handling
    const response = await axios.post(`/api/frontend/animal/report/found`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
      },
      timeout: 10000 // 10 seconds timeout
    });
    
    return response.data;

  } catch (error: any) {
    // More comprehensive error logging
    console.error('Full Error Object:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Response Error Data:', error.response.data);
      console.error('Response Error Status:', error.response.status);
      console.error('Response Error Headers:', error.response.headers);
      
      return {
        success: false,
        message: error.response.data?.message || 'Server responded with an error',
        errors: error.response.data?.errors || []
      };
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      return {
        success: false,
        message: 'No response from server',
        errors: []
      };
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message);
      return {
        success: false,
        message: error.message || 'Unexpected error occurred',
        errors: []
      };
    }
  } finally {
    console.log('CreaterReportFoundPetAction finished');
  }
}

export async function CreaterReportLostPetAction(formData: FormData) {
  for (const [key, value] of Array.from(formData.entries())) {
    console.log(`FormData Entry - Key: ${key}, Value:`, 
      value instanceof File ? `File: ${value.name}` : value
    );
  }

  try {
    // Detailed field validation
    const requiredFields = [
      'species', 'breed_id', 'owner_name',
      'contact_email', 'phone_number'
    ];

    for (const field of requiredFields) {
      const fieldValue = formData.get(field);
      console.log(`Checking field ${field}:`, fieldValue);
      
      if (!fieldValue) {
        console.error(`Missing required field: ${field}`);
        return {
          success: false,
          message: `Missing required field: ${field}`
        };
      }
    }
 // More robust error handling
 const response = await axios.post(`/api/frontend/animal/report/lost`, formData, {
  headers: {
    ...getAuthHeaders(),
    'Accept': 'application/json',
    'Content-Type': 'multipart/form-data'
  },
  timeout: 10000 // 10 seconds timeout
});

return response.data;

} catch (error: any) {
// More comprehensive error logging
console.error('Full Error Object:', error);

if (error.response) {
  // The request was made and the server responded with a status code
  console.error('Response Error Data:', error.response.data);
  console.error('Response Error Status:', error.response.status);
  console.error('Response Error Headers:', error.response.headers);
  
  return {
    success: false,
    message: error.response.data?.message || 'Server responded with an error',
    errors: error.response.data?.errors || []
  };
} else if (error.request) {
  // The request was made but no response was received
  console.error('No response received:', error.request);
  return {
    success: false,
    message: 'No response from server',
    errors: []
  };
} else {
  // Something happened in setting up the request
  console.error('Error setting up request:', error.message);
  return {
    success: false,
    message: error.message || 'Unexpected error occurred',
    errors: []
  };
}
} finally {
console.log('CreatReportLostPetAction finished');
}

  }


export async function getCondition(): Promise<ApiResponse<Record<string,string>>
>{
  try{
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