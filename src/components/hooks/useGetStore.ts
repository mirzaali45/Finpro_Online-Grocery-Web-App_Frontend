"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import {
  Store,
  StoreQueryParams,
  StoreSearchParams,
} from "@/types/get-store-types";
import { StoreService } from "@/services/getstore.service";

export const useStore = (
  storeId: number,
  initialProductParams = { page: 1, limit: 8 }
) => {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [productParams, setProductParams] = useState(initialProductParams);
  const [productPagination, setProductPagination] = useState({
    total: 0,
    page: 1,
    limit: 8,
    pages: 0,
  });

  const fetchStore = useCallback(
    async (params = productParams) => {
      setLoading(true);
      try {
        const response = await StoreService.getStoreById(storeId, params);

        startTransition(() => {
          if (response.status === "success" && response.data) {
            setStore(response.data);
            if (response.pagination) {
              setProductPagination(response.pagination);
            }
            setError(null);
          } else {
            setError(response.message || "Failed to fetch store");
            setStore(null);
          }
        });
      } catch (err) {
        startTransition(() => {
          setError("An unexpected error occurred");
          setStore(null);
        });
      } finally {
        setLoading(false);
      }
    },
    [storeId, productParams]
  );

  useEffect(() => {
    if (storeId) {
      fetchStore();
    }
  }, [storeId, productParams, fetchStore]);

  // Function to change product page
  const goToProductPage = useCallback((page: number) => {
    setProductParams((prev) => ({ ...prev, page }));
  }, []);

  // Function to change products per page
  const setProductsPerPage = useCallback((limit: number) => {
    setProductParams((prev) => ({ ...prev, page: 1, limit }));
  }, []);

  return {
    store,
    loading: loading || isPending,
    error,
    refetch: fetchStore,
    productPagination,
    goToProductPage,
    setProductsPerPage,
  };
};

export const useStores = (initialParams: StoreQueryParams = {}) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<StoreQueryParams>(initialParams);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [isPending, startTransition] = useTransition();

  const fetchStores = useCallback(
    async (queryParams: StoreQueryParams = params) => {
      setLoading(true);
      try {
        const response = await StoreService.getAllStores(queryParams);

        startTransition(() => {
          if (response.status === "success" && response.data) {
            setStores(response.data);
            if (response.pagination) {
              setPagination(response.pagination);
            }
            setError(null);
          } else {
            setError(response.message || "Failed to fetch stores");
            setStores([]);
          }
        });
      } catch (err) {
        startTransition(() => {
          setError("An unexpected error occurred");
          setStores([]);
        });
      } finally {
        setLoading(false);
      }
    },
    [params]
  );

  // Fetch stores when params change
  useEffect(() => {
    fetchStores();
  }, [params, fetchStores]);

  // Function to change page
  const goToPage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  // Function to change items per page
  const setItemsPerPage = useCallback((limit: number) => {
    setParams((prev) => ({ ...prev, page: 1, limit }));
  }, []);

  return {
    stores,
    loading: loading || isPending,
    error,
    pagination,
    goToPage,
    setItemsPerPage,
    refetch: fetchStores,
  };
};

/**
 * Hook for searching stores
 */
export const useStoreSearch = () => {
  const [searchResults, setSearchResults] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const searchStores = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const params: StoreSearchParams = { query };
      const response = await StoreService.searchStores(params);

      startTransition(() => {
        if (response.status === "success" && response.data) {
          setSearchResults(response.data);
          setError(null);
        } else {
          setError(response.message || "Failed to search stores");
          setSearchResults([]);
        }
      });
    } catch (err) {
      startTransition(() => {
        setError("An unexpected error occurred");
        setSearchResults([]);
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    searchResults,
    loading: loading || isPending,
    error,
    searchStores,
  };
};
