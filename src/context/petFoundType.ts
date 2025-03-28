export interface FoundPetFormData {
  animal_name: string;
  image_file?: File;
  species: string;
  breed_id: string;
  color: string;
  sex: string;
  size: string;
  date_found: string;
  condition: number;
  distinguishing_features: string;
  where_pet_was_found: string;
  additional_location_details: string;
  your_name: string;
  contact_email: string;
  phone_number: string;
  desc: string;
  location_coordinates: {
    lat: number;
    lng: number;
};
}