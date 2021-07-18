import Backend from 'common/backend';
import { DogLite } from '../common/types/dogs';

export const searchDogs = (breedName: string) => Backend.get<DogLite[]>('breeds/search?q='+breedName);
export const getAllDogs = () => Backend.get<DogLite[]>('breeds');