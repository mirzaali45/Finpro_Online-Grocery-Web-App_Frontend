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
        console.log("error api:", data)
        throw new Error(data || "Gagal mendapatkan ongkir");
    }

    return data;
}