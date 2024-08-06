interface ContactPerson {
    name: string;
    email: string;
    phone: string;
    gender: string;
    salutation: string;
    role: string;
}

interface CarType {
    make: string;
    logoUrl: string;
}

export interface ServiceOffered {
    name: string;
    price: number;
    description: string;
    currency: string;
    id: string;
}

interface Appointments{
    date: string;
    time: string;
    id: string;
    notes: string;
}

export interface Vehicle {
    licensePlate: string,
    chassisNumber: string,
    carType: CarType[],
    currentMileage: string,
    lastServiceDate: string,
}

export default interface Garage {
    name: string;
    createdAt: string;
    status: string;
    district: string;
    address: string;
    logo: string;
    averageRating?: number;
    totalReviews?: number;
    carTypes?: CarType[];
    servicesOffered?: ServiceOffered[];
    contactPerson: ContactPerson;
    appointments: Appointments[];
};