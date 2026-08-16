import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { api } from '../services/api';

export interface SearchSuggestResponse {
  query: string;
  found: boolean;
  products: Array<{ id: number; sku: string; name: string; base_price?: number; image_url: string; category_name: string }>;
  categories: Array<{ id: number; name: string; slug: string }>;
  didYouMean?: string;
  popularFallback?: Array<{ id: number; sku: string; name: string; base_price?: number; image_url: string }>;
}

export const useSearchSuggestions = (query: string, delay: number = 300) => {
  const [results, setResults] = useState<SearchSuggestResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults(null);
      setLoading(false);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      setError(null);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const response = await api.get<SearchSuggestResponse>(`/catalog/search/suggestions?q=${encodeURIComponent(query)}&limit=5`, {
          signal: abortController.signal
        });
        setResults(response.data);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Request cancelled', err.message);
        } else {
          setError('Error fetching suggestions');
        }
      } finally {
        if (abortControllerRef.current === abortController) {
          setLoading(false);
        }
      }
    };

    const handler = setTimeout(() => {
      fetchSuggestions();
    }, delay);

    return () => {
      clearTimeout(handler);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query, delay]);

  return { results, loading, error };
};
