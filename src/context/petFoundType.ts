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


export interface LostPetFormData {
  animal_name: string;
  image_file?: File;
  species: string;
  breed_id: string;
  color: string;
  sex: string;
  size: string;
  date_lost: string;
  distinguishing_features: string;
  nearest_address_last_seen: string; 
  additional_location_details: string;
  owner_name: string;
  contact_email:string;
  phone_number:string;
  reward: string;
  desc:string;


}

export interface EditReportLostParams{
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