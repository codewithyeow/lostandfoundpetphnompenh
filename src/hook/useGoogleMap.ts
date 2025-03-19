'use client';

import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { toast } from 'react-toastify';

type Position = google.maps.LatLngLiteral;

interface MapOptions {
   center: Position;
   zoom: number;
}

interface UseGoogleMapReturn {
   position: Position;
   isLoaded: boolean;
   loadError: Error | undefined;
   setPosition: (position: Position) => void;
   onLoad: (mapInstance: google.maps.Map) => void;
   onUnmount: () => void;
   onMarkerLoad: (marker: google.maps.Marker) => void;
   onMarkerUnmount: () => void;
   getCurrentLocation: (e?: MouseEvent<HTMLButtonElement>) => void;
}

const defaultMapOptions: MapOptions = {
   center: { lat: 11.556192627894063, lng: 104.9284248686477 }, 
   zoom: 15,
};

const delay = 1000;

export default function useGoogleMap(
   apiKey: string,
   mapOptions: MapOptions = defaultMapOptions
): UseGoogleMapReturn {
   const { isLoaded, loadError } = useJsApiLoader({
      googleMapsApiKey: apiKey,
      id: 'google-map-script',
   });

   const [map, setMap] = useState<google.maps.Map | null>(null);
   const [position, setPosition] = useState<Position>(mapOptions.center);
   const markerRef = useRef<google.maps.Marker | null>(null);

   const onLoad = useCallback((mapInstance: google.maps.Map) => {
      setMap(mapInstance);
   }, []);

   const onUnmount = useCallback(() => {
      setMap(null);
   }, []);

   const onMarkerLoad = useCallback((marker: google.maps.Marker) => {
      marker.setAnimation(google.maps.Animation.DROP);
      markerRef.current = marker;
   }, []);

   const onMarkerUnmount = useCallback(() => {
      markerRef.current = null;
   }, []);

   const onAnimateMarker = useCallback(() => {
      if (!markerRef.current) return;
      markerRef.current.setAnimation(google.maps.Animation.BOUNCE);
      const timeout = setTimeout(() => {
         if (markerRef.current) {
            markerRef.current.setAnimation(null);
         }
      }, 500);
      return () => clearTimeout(timeout);
   }, []);

   const requestLocation = () => {
      navigator.geolocation.getCurrentPosition(
         (position) => {
            const { coords } = position;
            setPosition({ lat: coords.latitude, lng: coords.longitude });
            onAnimateMarker();
         },
         () => {
            toast.warn('Unable to retrieve your location.', { delay });
         },
         {
            enableHighAccuracy: true,
            timeout: 3000,
            maximumAge: 0,
         }
      );
   };

   const getCurrentLocation = (e?: MouseEvent<HTMLButtonElement>) => {
      e?.preventDefault();
      e?.stopPropagation();

      if (navigator.geolocation) {
         navigator.permissions.query({ name: 'geolocation' }).then((permission) => {
            if (permission.state === 'granted') {
               requestLocation();
            } else if (permission.state === 'prompt') {
               requestLocation();
            } else if (permission.state === 'denied') {
               toast.warn(
                  'Location access has been denied. Please enable location permissions in your browser settings.',
                  { delay }
               );
            }
         });
      } else {
         toast.warn('Geolocation is not supported by this browser', { delay });
      }
   };

   useEffect(() => {
      if (isLoaded && map) {
         const onDrag = () => {
            if (!map || !markerRef.current) return;
            const center = map.getCenter();
            if (center) {
               markerRef.current.setPosition({
                  lat: center.lat(),
                  lng: center.lng(),
               });
            }
         };

         const onDragEnd = () => {
            if (!map) return;
            const center = map.getCenter();
            if (center) {
               const lat = center.lat();
               const lng = center.lng();
               setPosition({ lat, lng });
               onAnimateMarker();
            }
         };

         const onZoomChange = () => {
            if (!map) return;
            const center = map.getCenter();
            if (center) {
               const lat = center.lat();
               const lng = center.lng();
               setPosition({ lat, lng });
               if (markerRef.current) {
                  markerRef.current.setPosition({ lat, lng });
               }
            }
         };

         map.addListener('drag', onDrag);
         map.addListener('dragend', onDragEnd);
         map.addListener('zoom_changed', onZoomChange);

         return () => {
            google.maps.event.clearListeners(map, 'drag');
            google.maps.event.clearListeners(map, 'dragend');
            google.maps.event.clearListeners(map, 'zoom_changed');
         };
      }
   }, [isLoaded, map]);

   return {
      position,
      isLoaded,
      loadError,
      setPosition,
      onLoad,
      onUnmount,
      onMarkerLoad,
      onMarkerUnmount,
      getCurrentLocation,
   };
}
