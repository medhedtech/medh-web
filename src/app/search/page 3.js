"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Head from "next/head";
import SearchResults from "@/components/sections/search/SearchResults";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

/**
 * YouTube-style search page for the Medh platform
 * Shows search results with filterable options similar to YouTube's UX
 */
export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [pageTitle, setPageTitle] = useState("Search Results");

  useEffect(() => {
    // Update page title based on search query
    if (query) {
      setPageTitle(`"${query}" - Search Results | Medh`);
      // Update document title for browser tab
      document.title = `${query} - Search Results | Medh`;
    } else {
      setPageTitle("Search | Medh");
      document.title = "Search | Medh";
    }
  }, [query]);

  return (
    <PageWrapper>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={`Search results for ${query} on Medh platform`} />
      </Head>

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="pt-16 pb-4"> {/* Padding for fixed navbar */}
          <SearchResults initialQuery={query} />
        </div>
      </main>
    </PageWrapper>
  );
} 