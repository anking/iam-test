export interface DogLite {
    id:number;
    name:string;
    breed_for:string;
    breed_group:string;
    height: DogHeight;
    reference_image_id:string;
}

export interface DogHeight {
    imperial: string;
    metric: string;
}

export interface GetImageResponse {
    url: string;
    status?: number;
    message?: string;
    breeds?: DogLite[];
}