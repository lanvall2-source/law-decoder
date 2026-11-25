"use client";

import { useState, useEffect } from "react";
import type {
  ContractReviewResult,
  LawsuitDraftOutput,
  LocalStorageState,
} from "@/types/legal";

const STORAGE_KEY = "law_decoder_state_v1";

const DEFAULT_STATE: LocalStorageState = {
  recentReviews: [],
  savedTerms: [],
  lawsuitDrafts: [],
};

export function useLegalStorage() {
  const [state, setState] = useState<LocalStorageState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setState({
          recentReviews: Array.isArray(parsed.recentReviews) ? parsed.recentReviews : [],
          savedTerms: Array.isArray(parsed.savedTerms) ? parsed.savedTerms : [],
          lawsuitDrafts: Array.isArray(parsed.lawsuitDrafts) ? parsed.lawsuitDrafts : [],
        });
      }
    } catch {
      // Ignore corrupt storage
    } finally {
      setHydrated(true);
    }
  }, []);

  const persist = (next: LocalStorageState) => {
    setState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Handle QuotaExceededError gracefully
    }
  };

  const addReview = (review: ContractReviewResult) => {
    const next = {
      ...state,
      recentReviews: [review, ...state.recentReviews].slice(0, 10),
    };
    persist(next);
  };

  const toggleSaveTerm = (slug: string) => {
    const exists = state.savedTerms.includes(slug);
    const next = {
      ...state,
      savedTerms: exists
        ? state.savedTerms.filter((s) => s !== slug)
        : [slug, ...state.savedTerms].slice(0, 30),
    };
    persist(next);
  };

  const addLawsuitDraft = (draft: LawsuitDraftOutput) => {
    const next = {
      ...state,
      lawsuitDrafts: [draft, ...state.lawsuitDrafts].slice(0, 10),
    };
    persist(next);
  };

  return {
    hydrated,
    recentReviews: state.recentReviews,
    savedTerms: state.savedTerms,
    lawsuitDrafts: state.lawsuitDrafts,
    addReview,
    toggleSaveTerm,
    addLawsuitDraft,
  };
}
