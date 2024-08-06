import { useState, useEffect } from 'react';
import { database } from '@/appwrite/appwrite';
import environment from '@/environments/environment';

export default function useAppwriteData() {
  // Define states for car types, garage data, services, and errors
  const [carTypes, setCarTypes] = useState<any>(null);
  const [garageData, setGarageData] = useState<any>(null);
  const [services, setServices] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch data from the database
    const fetchData = async () => {
      try {
        // Fetch car data
        const carData = (
          await database.listDocuments(
            environment.appwriteDatabaseId,
            environment.appwriteCarTypesCollectionId
          )
        ).documents;

        // Fetch garage data
        const garageData = (
          await database.listDocuments(
            environment.appwriteDatabaseId,
            environment.appwriteGarageCollectionId
          )
        ).documents;

        // Fetch services offered data
        const servicesOffered = (
          await database.listDocuments(
            environment.appwriteDatabaseId,
            environment.appwriteServicesCollectionId
          )
        ).documents;

        // Set states for fetched data
        setGarageData(garageData || null);
        setCarTypes(carData || null);
        setServices(servicesOffered || null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error as Error);
      }
    };

    // Call fetchData() when the component mounts
    fetchData();
  }, [error]); // The empty dependency array ensures this effect runs only once

  // Return the fetched data and error
  return {
    carTypes,
    garageData,
    services,
    error,
  };
}
