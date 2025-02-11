export interface Address {
  address_id: number;
  user_id: number;
  address_name: string;
  address: string;
  subdistrict: string;
  city: string;
  province: string;
  city_id: string;
  province_id: number;
  postcode: number;
  latitude: number;
  longitude: number;
  is_primary: boolean;
}
export interface AddressAdd {
  address_name: string;
  address: string;
  subdistrict: string;
  city: string;
  city_id: string;
  province: string;
  province_id: string;
  postcode: string;
  latitude: string;
  longitude: string;
}