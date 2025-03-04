import emotionIsPropValid from '@emotion/is-prop-valid';
import { ApiResponse } from 'interfaces';
import { notFound } from 'next/navigation';

export const isValidProp = (prop: string) => emotionIsPropValid(prop);


export function handleImageError({ currentTarget }: { currentTarget: HTMLImageElement }) {
   currentTarget.onerror = null; // Prevents infinite loop if the placeholder fails
   currentTarget.srcset = '/assets/images/placeholder.png'; // Set the fallback image
}

// Corrected getInitialApiResponse function to match the ApiResponse structure
export function getInitialApiResponse<T>(): ApiResponse<T> {
   return {
      success: false,
      title: '',
      code: 0,
      message: '',
      result: {} as T, // Default empty object casted to T
      errors: {},
   };
}
