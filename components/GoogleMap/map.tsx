"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import GarageMarker from "@/assets/images/garageMarker.png";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
} from "@react-google-maps/api";
import DatabaseService from "@/lib/services/database.service";
import environment from "@/environments/environment";
// import Places from "@/components/GoogleMap/places";
import fetchedGarages from "@/utils/data/garages.json";

export type LatLngLiteral = google.maps.LatLngLiteral;
export type DirectionsResults = google.maps.DirectionsResult;
export type MapOptions = google.maps.MapOptions;

interface MapProps {
  mapRef: React.RefObject<GoogleMap | null>;
  garage: LatLngLiteral | undefined;
  setGarage: React.Dispatch<React.SetStateAction<LatLngLiteral | undefined>>;
}

const Map: React.FC<MapProps> = ({ mapRef, garage, setGarage }) => {
  const { appwriteGarageCollectionId, appwriteDatabaseId } = environment;
  const [garages, setGarages] = useState<any>([]);
  const [directions, setDirections] = useState<DirectionsResults | null>(null);
  const center = useMemo<LatLngLiteral>(
    () => ({ lat: 0.3136, lng: 32.581 }),
    []
  );
  const options = useMemo<MapOptions>(() => {
    return {
      disableDefaultUI: true,
      clickableIcons: false,
    };
  }, []);

  const fetchDirections = (currentLocation: LatLngLiteral) => {
    console.log("Current Location: ", currentLocation);
    if (garage) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: currentLocation,
          destination: garage,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            setDirections(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  };

  useEffect(() => {
    const fetchGarages = async () => {
      try {
        const garages: any = await DatabaseService.listDocuments(
          appwriteDatabaseId,
          appwriteGarageCollectionId
        );

        console.log("Garages: ", garages);

        setGarages(() => garages?.documents ?? []);
      } catch (error: any) {
        console.timeLog(error);
      }
    };
    fetchGarages();
  }, []);

  const svgMarker = {
    path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "blue",
    fillOpacity: 0.6,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
    anchor: new google.maps.Point(0, 20),
  };
  return (
    <div className="w-full h-64 rounded-lg overflow-hidden">
      <GoogleMap
        zoom={10}
        center={center}
        mapContainerStyle={{ height: "100%", width: "100%" }}
        options={options}
      >
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                zIndex: 50,
                strokeColor: "#D94C23",
                strokeWeight: 5,
              },
            }}
          />
        )}
        {garage && (
          <>
            <Marker position={garage} />
            <MarkerClusterer>
              {(clusterer) => {
                return (
                  garages &&
                  garages?.length > 0 &&
                  garages.map((garage: any) => {
                    return (
                      <Marker
                        key={garage.index}
                        position={{
                          lat: garage.garageAddress.latitude,
                          lng: garage.garageAddress.longitude,
                        }}
                        clusterer={clusterer}
                        onClick={() => {
                          fetchDirections({
                            lat: garage.garageAddress.latitude,
                            lng: garage.garageAddress.longitude,
                          });
                          console.log("Getting directions here");
                        }}
                      />
                    );
                  })
                );
              }}
            </MarkerClusterer>

            {garages &&
              garages?.length > 0 &&
              garages.map((garage: any) => (
                <Marker
                  key={garage.$id}
                  position={{ lat: garage.latitude, lng: garage.longitude }}
                  icon={ svgMarker}
                />
              ))}
            <Circle center={garage} radius={1000} options={closeOptions} />
            <Circle center={garage} radius={2500} options={middleOptions} />
            <Circle center={garage} radius={5000} options={farOptions} />
          </>
        )}
      </GoogleMap>
    </div>
  );
};

const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 1,
  clickable: false,
  draggable: true,
  editable: false,
  visible: true,
};

const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.05,
  strokeColor: "#5BFF40",
  fillColor: "5BFF40",
};

const middleOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.05,
  strokeColor: "#FAB837",
  fillColor: "#FAB837",
};

const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.05,
  strokeColor: "#FF4040",
  fillColor: "#FF4040",
};

// const generageGarages = (position: LatLngLiteral) => {
//   const _garages: Array<LatLngLiteral> = [];
//   for (let i = 0; i < 100; i++) {
//     const direction = Math.random() < 0.5 ? -2 : 2;
//     _garages.push({
//       lat: position.lat + (direction * Math.random()) / direction,
//       lng: position.lng + (direction * Math.random()) / direction,
//     });
//   }

//   return _garages;
// };

export default Map;
