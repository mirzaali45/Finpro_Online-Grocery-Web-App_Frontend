// types/store-types.ts

// Full Store Data interface for create/update operations
export interface StoreData {
  store_id?: number;
  store_name: string;
  address: string;
  subdistrict: string;
  city: string;
  province: string;
  postcode: string;
  latitude?: number;
  longitude?: number;
  user_id?: number;
  description?: string;
}

<<<<<<< HEAD
=======
export interface EditData {
  store_id?: number;
  store_name: string;
  address: string;
  subdistrict: string;
  city: string;
  province: string;
  postcode: string;
  latitude?: number;
  longitude?: number;
  user_id: number;
}

>>>>>>> 62c2c231c94f84dc4574bf680ec2ffc3b2ccc68a
// Simplified Store interface for list display
export interface StoreDisplay {
  store_id: number;
  store_name: string;
  address: string;
  city: string;
}

<<<<<<< HEAD
=======

export interface StoreDataV2 {
  store_id: string;
  store_name: string;
  subdistrict: string;
  city: string;
  province: string;
  address: string;
  postcode: string;
  latitude: string;
  longitude: string;
}

>>>>>>> 62c2c231c94f84dc4574bf680ec2ffc3b2ccc68a
// Type for store data keys
export type StoreDataKey = keyof StoreData;

// Base form errors interface
export interface FormErrors {
  store_name: string;
  address: string;
  subdistrict: string;
  city: string;
  province: string;
  postcode: string;
}

// Extended form errors type with optional store data keys
export type FormErrorsWithIndex = FormErrors & {
  [K in StoreDataKey]?: string;
};
