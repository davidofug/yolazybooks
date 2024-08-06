import React, { useState, useRef, useEffect, useMemo } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { useFormikContext } from "formik";
import environment from "@/environments/environment";
import { GarageFormValues } from "@/utils/validators/garageValidator";

interface MapProps {
  inputRef: React.RefObject<HTMLInputElement>;
}

const Map: React.FC<MapProps> = ({ inputRef }) => {
  const { setFieldValue, values } = useFormikContext<GarageFormValues>();
  const center = useMemo(() => {
    return {
      lat: values?.garageAddress?.latitude ?? 0.3136,
      lng: values?.garageAddress?.longitude ?? 32.581,
    };
  }, [ values?.garageAddress ]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: environment.googleMapsApiKey,
    libraries: ["places"],
  });

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const ugandaBounds = {
    east: 35.000308,
    west: 29.573957,
    north: 4.214667,
    south: -1.483333,
  };

  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [searchLngLat, setSearchLngLat] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          bounds: ugandaBounds,
          componentRestrictions: { country: "UG" },
          fields: ["address_components", "geometry", "name"],
        }
      );

      autocompleteRef.current.addListener("place_changed", handlePlaceChanged);
    }
  }, [isLoaded]);

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place: google.maps.places.PlaceResult =
        autocompleteRef.current.getPlace();
      if (place && place.geometry) {
        const geometry = place.geometry.location;
        if (geometry) {
          const lat: number = geometry.lat();
          const lng: number = geometry.lng();

          setFieldValue("garageAddress.name", place.name || "");
          setFieldValue("garageAddress.longitude", lng);
          setFieldValue("garageAddress.latitude", lat);
          setSelectedPlace(place);
          setSearchLngLat({ lat, lng });
          setCurrentLocation(null);
        }
      }
    }
  };

  const handleMarkerDragEnd = async (event: any) => {
    const newLatLng = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    setMarkerPosition(newLatLng);

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: newLatLng }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const address = results[0].formatted_address;
        setFieldValue("garageAddress.name", address);
        setFieldValue("garageAddress.longitude", newLatLng.lng);
        setFieldValue("garageAddress.latitude", newLatLng.lat);

        if (inputRef.current) {
          inputRef.current.value = address;
        }
        setSearchLngLat(newLatLng);
        setCurrentLocation(null);
      }
    });
  };

  const mapContainerStyle = {
    width: "100%",
    height: "16rem",
    margin: "auto",
    borderRadius: "0.5rem",
  };

  return (
    <div className="flex flex-col justify-center items-start gap-1">
      <label
        htmlFor="garageAddress"
        className="font-body text-base font-regular"
      >
        Garage Address
      </label>
      <input
        id="garageAddress"
        ref={inputRef}
        defaultValue={values?.garageAddress?.name ?? ""}
        type="text"
        placeholder="Search your garage address"
        className="w-full outline-none border-[0.5px] border-secondary-200 focus:border-secondary-500 p-2 rounded font-body text-base font-light"
      />
      {isLoaded && !loadError && (
        <GoogleMap
          zoom={currentLocation || selectedPlace || markerPosition ? 18 : 12}
          center={currentLocation || searchLngLat || center}
          mapContainerStyle={mapContainerStyle}
        >
          <Marker
            position={searchLngLat || center}
            draggable={true}
            onDragEnd={handleMarkerDragEnd}
          />
          {currentLocation && <Marker position={currentLocation} />}
        </GoogleMap>
      )}
    </div>
  );
};

export default Map;
