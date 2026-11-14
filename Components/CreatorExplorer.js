"use client";

import { useEffect, useRef, useState } from "react";
import CreatorCard from "@/Components/CreatorCard";
import { CreatorGridSkeleton } from "@/Components/Skeletons";

const pageSize = 12;

async function fetchCreators({ query, sort, page, signal }) {
  const searchParams = new URLSearchParams({
    sort,
    page: String(page),
  });

  if (query) {
    searchParams.set("q", query);
  }

  const response = await fetch(`/api/creators?${searchParams.toString()}`, {
    cache: "no-store",
    signal,
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Could not load creators.");
  }

  return result;
}

const sortChoices = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "username-asc", label: "Username: A to Z" },
  { value: "username-desc", label: "Username: Z to A" },
];

export default function CreatorExplorer({ focusSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sort, setSort] = useState("newest");
  const [creators, setCreators] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const searchInputRef = useRef(null);
  const loadMoreControllerRef = useRef(null);
  const currentSearch = searchTerm.trim();
  const isSearching = currentSearch !== debouncedSearchTerm || isLoading;

  function cancelLoadMore() {
    loadMoreControllerRef.current?.abort();
    loadMoreControllerRef.current = null;
    setIsLoadingMore(false);
  }

  function handleSearchChange(event) {
    const nextSearch = event.target.value;
    if (nextSearch.trim() !== currentSearch) {
      cancelLoadMore();
      setIsLoading(true);
      setErrorMessage("");
    }
    setSearchTerm(nextSearch);
  }

  function handleSortChange(event) {
    cancelLoadMore();
    setIsLoading(true);
    setErrorMessage("");
    setSort(event.target.value);
  }

  function retry() {
    cancelLoadMore();
    setIsLoading(true);
    setErrorMessage("");
    setRetryCount((count) => count + 1);
  }

  useEffect(() => {
    if (focusSearch) {
      searchInputRef.current?.focus();
    }
  }, [focusSearch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchTerm(currentSearch);
    }, 300);

    return () => clearTimeout(timeout);
  }, [currentSearch]);

  useEffect(() => {
    loadMoreControllerRef.current?.abort();
    loadMoreControllerRef.current = null;

    if (currentSearch !== debouncedSearchTerm) {
      return undefined;
    }

    const controller = new AbortController();

    async function loadFirstPage() {
      try {
        const result = await fetchCreators({
          query: debouncedSearchTerm,
          sort,
          page: 1,
          signal: controller.signal,
        });

        setCreators(result.creators);
        setPage(result.page);
        setHasMore(result.hasMore);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Could not load creators.", error);
          setErrorMessage("We couldn’t load creators right now. Please try again.");
          setCreators([]);
          setPage(1);
          setHasMore(false);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadFirstPage();
    return () => {
      controller.abort();
      loadMoreControllerRef.current?.abort();
    };
  }, [currentSearch, debouncedSearchTerm, sort, retryCount]);

  async function loadMore() {
    if (isSearching || isLoadingMore || !hasMore) {
      return;
    }

    const controller = new AbortController();
    loadMoreControllerRef.current?.abort();
    loadMoreControllerRef.current = controller;
    setIsLoadingMore(true);
    setErrorMessage("");

    try {
      const result = await fetchCreators({
        query: debouncedSearchTerm,
        sort,
        page: page + 1,
        signal: controller.signal,
      });

      setCreators((currentCreators) => [...currentCreators, ...result.creators]);
      setPage(result.page);
      setHasMore(result.hasMore);
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error("Could not load more creators.", error);
        setErrorMessage("We couldn’t load more creators. Please try again.");
      }
    } finally {
      if (loadMoreControllerRef.current === controller) {
        loadMoreControllerRef.current = null;
        setIsLoadingMore(false);
      }
    }
  }

  return (
    <div>
      <div className="mt-8 grid gap-4 rounded-2xl border border-coffee-border bg-warm-white p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:p-5">
        <div className="min-w-0">
          <label
            className="mb-2 block text-sm font-semibold text-espresso"
            htmlFor="creator-search"
          >
            Search by name or username
          </label>
          <div className="relative">
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-mocha"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 4.5 4.5" />
            </svg>
            <input
              autoComplete="off"
              className="w-full rounded-xl border border-coffee-border bg-cream py-3 pl-12 pr-4 text-espresso outline-none transition focus:border-coffee focus:ring-2 focus:ring-coffee/20"
              id="creator-search"
              maxLength={80}
              placeholder="Try a creator name or username"
              ref={searchInputRef}
              type="search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="min-w-0 sm:w-56">
          <label
            className="mb-2 block text-sm font-semibold text-espresso"
            htmlFor="creator-sort"
          >
            Sort by
          </label>
          <select
            className="w-full rounded-xl border border-coffee-border bg-cream px-4 py-3 text-espresso outline-none transition focus:border-coffee focus:ring-2 focus:ring-coffee/20"
            id="creator-sort"
            value={sort}
            onChange={handleSortChange}
          >
            {sortChoices.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 min-h-7" aria-live="polite">
        {isSearching && (
          <p className="inline-flex items-center gap-2 text-sm text-mocha" role="status">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-coffee-border border-t-coffee motion-reduce:animate-none" />
            Searching creators…
          </p>
        )}
      </div>

      {errorMessage && (
        <section
          aria-labelledby="creator-error-title"
          className="mt-3 rounded-2xl border border-coffee-border bg-warm-white px-6 py-10 text-center shadow-sm"
        >
          <h2
            className="font-heading text-2xl font-bold text-espresso"
            id="creator-error-title"
          >
            Creators are taking a coffee break
          </h2>
          <p className="mt-2 text-mocha">{errorMessage}</p>
          <button
            className="mt-5 rounded-full bg-coffee px-6 py-3 font-semibold text-warm-white transition-colors hover:bg-dark-roast"
            onClick={retry}
            type="button"
          >
            Try again
          </button>
        </section>
      )}

      {!errorMessage && isLoading && (
        <CreatorGridSkeleton className="mt-3" count={pageSize} />
      )}

      {!errorMessage && !isLoading && creators.length > 0 && (
        <div className="mt-3 grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map((creator) => (
            <CreatorCard creator={creator} key={creator.username} responsive />
          ))}
        </div>
      )}

      {!errorMessage && !isSearching && creators.length === 0 && (
        <section className="mt-3 rounded-2xl border border-coffee-border bg-warm-white px-6 py-12 text-center shadow-sm">
          <h2 className="font-heading text-2xl font-bold text-espresso">
            {debouncedSearchTerm ? "No creators found" : "Your next favorite creator is brewing"}
          </h2>
          <p className="mt-2 text-mocha">
            {debouncedSearchTerm
              ? "Try another name or username."
              : "No creators have joined yet. Check back soon to discover someone new."}
          </p>
        </section>
      )}

      {!errorMessage && hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            className="rounded-full border border-coffee px-7 py-3 font-semibold text-coffee transition-colors hover:bg-latte disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSearching || isLoadingMore}
            onClick={loadMore}
            type="button"
          >
            {isLoadingMore ? "Loading creators..." : "Load more creators"}
          </button>
        </div>
      )}
    </div>
  );
}
