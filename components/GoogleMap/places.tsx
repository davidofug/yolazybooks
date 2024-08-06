import React, { useRef, useEffect } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { useFormikContext, Field } from "formik";
import { LatLngLiteral } from "./map";

interface PlacesProps {
  setGarage: (position: google.maps.LatLngLiteral) => void;
}
const Places: React.FC<PlacesProps> = ({ setGarage }: PlacesProps) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setFieldValue } = useFormikContext();

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place: google.maps.places.PlaceResult =
        autocompleteRef.current.getPlace();
      if (place && place.geometry) {
        const geometry = place.geometry.location;
        if (geometry) {
          const lat: number = geometry.lat();
          const lng: number = geometry.lng();

          setFieldValue("location.name", place.name || "");
          setFieldValue("location.longitude", lng);
          setFieldValue("location.latitude", lat);
          setGarage({ lat, lng });
        }
      }
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          componentRestrictions: { country: "UG" },
          fields: ["address_components", "geometry", "name"],
        }
      );

      autocompleteRef.current.addListener("place_changed", handlePlaceChanged);
    }
  }, []);
  return (
    <input
      ref={inputRef}
      type="text"
      className="border-[0.5px] border-secondary-100 placeholder:font-body placeholder:font-light focus:border-secondary-500 rounded-md py-1 px-2 h-10 outline-none font-body text-base font-light col-span-2"
      placeholder="Enter location"
    />
  );
};

export default Places;
