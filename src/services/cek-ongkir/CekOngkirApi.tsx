import { ShippingRateResponseNew } from "@/types/cekongkir-types";

export async function CekOngkirApi(
  origin: string, // asal atau alamat toko dalam bentuk kota
  destination: string, // tujuan atau alamat customer dalam bentuk kota
  weight: string, // berat barang
  couriers: string // jasa kurir
): Promise<ShippingRateResponseNew> {
  // fetch ke api express
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_BE}/cek-ongkir`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ origin, destination, weight, couriers }),
  });

  // data hasil dari express
  const data: ShippingRateResponseNew = await res.json();

  if (!data) {
    console.log("error api:", data);
    throw new Error(data || "Gagal mendapatkan ongkir");
  }

  return data;
}

export async function CheckPricing(
  postcodeReceiver: number | undefined, // kode pos penerima
  postcodeSender: number | undefined, // kode pos pengirim
  weight?: number | undefined, // berat barang dalam Kg
  price?: number | undefined // total harga barang
): Promise<any> {
  // fetch ke api location
  const idLocation1 = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL_BE}/rajaongkir/location?keyword=${postcodeReceiver}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  const idLocation2 = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL_BE}/rajaongkir/location?keyword=${postcodeSender}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  let origin = await idLocation1?.json();
  let destination = await idLocation2?.json();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL_BE}/rajaongkir/cost`,
    {
      method: "POST",
      body: JSON.stringify({
        origin: origin?.data?.[0]?.id,
        destination: destination?.data?.[0]?.id,
        weight: 1,
        price: 250000
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  // data hasil dari express
  const data: any = await res.json();

  if (!data) {
    console.log("error api:", data);
    throw new Error(data || "Gagal mendapatkan ongkir");
  }

  return data;
}
