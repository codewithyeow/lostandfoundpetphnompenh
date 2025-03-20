import { ReactNode } from 'react';

export interface SpeciesOption {
  value: string;
  label: string;
  icon: ReactNode;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PetFormData {
  petName: string;
  dateLost: string;
  images: File[];
  nearestLocation: string;
  lat: number;
  lng: number;
  locationDetails: string;
  species: string;
  breed: string;
  color: string;
  size: string;
  gender: string;
  age: string;
  distinguishingFeatures: string;
  contactEmail: string;
  phone: string;
  ownerName: string;
  reward: string;
  status: string;
  locationCoordinates: Coordinates;
}