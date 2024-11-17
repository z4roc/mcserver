"use client";

import { getFeaturedModpacks, getMods, searchModpacks } from "@/lib/curseforge_api";
import type { Featured, Modpack } from "@/types/modpack";
import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { VanillaCard } from "@/components/VanillaCard";
import {Modcard} from "@/components/Modcard";

export default function Modpacks() {
  const [modpacks, setModpacks] = useState<Modpack[] | null>(null);
  const [featured, setFeatured] = useState<Featured | null>(null);
  const [searchResults, setSearchResults] = useState<Modpack[] | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const inputTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getMods().then((result) => {
      setModpacks(result);
    });
    getFeaturedModpacks().then((result) => {
      setFeatured(result);
    });
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchModpacks(searchQuery).then((result) => {
        setSearchResults(result);
      });
    } else {
      setSearchResults(null); // Clear results if the query is empty
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear the previous timeout if it exists
    if (inputTimeout.current) {
      clearTimeout(inputTimeout.current);
    }

    // Set a new timeout for 2 seconds
    inputTimeout.current = setTimeout(() => {
      handleSearch();
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
  };

  return (
    <main className="flex flex-col">
      <div className="m-2 p-4">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search modpacks..."
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-grow"
          />
          <button
            onClick={handleSearch}
            className="px-4 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
          >
            Search
          </button>
          {searchResults && (
            <button
              onClick={clearSearch}
              className="px-4 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center"
            >
              Clear
            </button>
          )}
        </div>

        <section id="modpacks">
          <div className="flex flex-col gap-4">
            {searchResults ? (
              <>
                <h1 className="text-lg font-bold mt-4 mb-4">
                  Search Results for {'\''}{searchQuery}{'\''}
                </h1>
                {searchResults.length > 0 ? (
                  searchResults.map((mod) => <Modcard modpack={mod} key={mod.id} />)
                ) : (
                  <p>No results found.</p>
                )}
              </>
            ) : (
              <>
                <section id="vanilla">
                  <h1 className="text-lg font-bold mt-4 mb-4">Vanilla</h1>
                  <VanillaCard />
                </section>
                <h1 className="text-lg font-bold mt-4 mb-4">Modpacks</h1>
                <h1>Fully Supported</h1>
                {modpacks &&
                  modpacks.map((mod) => <Modcard modpack={mod} key={mod.id} />)}
                <h1>Featured by Curseforge</h1>
                {featured &&
                  featured.featured.map((mod) => <Modcard modpack={mod} key={mod.id} />)}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
