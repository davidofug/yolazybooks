interface FavoritePlace {
  name: string;
  longitude: number;
  latitude: number;
}

interface Category {
  name: string;
  description: string;
}

interface User {
  firstName: string;
  lastName: string;
  salutation: string;
  gender: string;
  email: string;
  currentGarageName: string;
  mechanicName: string;
  mechanicPhone: string;
  recommendation: boolean;
  favoritePlaces: {
    category: Category;
    place: FavoritePlace[];
  }[];
}

export default User;
