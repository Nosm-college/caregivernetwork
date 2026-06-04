import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { getJobs, searchJobs, seedSampleJobs } from "../firebase/jobs";
import JobCard from "../components/JobCard";
import FilterSidebar from "../components/FilterSidebar";
import TrustedCompanies from "../components/TrustedCompanies";
import CareerServicesSection from "../components/CareerServicesSection";
import {
  Search,
  Loader2,
  Database,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const PAGE_SIZE = 10;

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    contractType: "",
    salaryRange: "",
    vacantOnly: false,
  });
  const [seeding, setSeeding] = useState(false);
  const searchQuery = searchParams.get("search") || "";

  // Use a ref for the page cursor cache so it never causes stale closures
  const pageCacheRef = useRef({}); // { page: { jobs, lastDoc } }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // ── Core loader ──────────────────────────────────────────────
  const loadPage = async (page, freshCache = false) => {
    setLoading(true);

    if (freshCache) pageCacheRef.current = {};

    try {
      // Search mode — no pagination
      if (searchQuery) {
        const found = await searchJobs(searchQuery);
        const result = filters.vacantOnly
          ? found.filter((j) => j.isVacant)
          : found;
        setJobs(result);
        setTotalCount(result.length);
        return;
      }

      // Return cached page instantly
      const cached = pageCacheRef.current[page];
      if (cached) {
        const result = filters.vacantOnly
          ? cached.jobs.filter((j) => j.isVacant)
          : cached.jobs;
        setJobs(result);
        return;
      }

      // Need the previous page's lastDoc cursor to fetch the next page
      const prevLastDoc =
        page > 1 ? pageCacheRef.current[page - 1]?.lastDoc : null;

      // If we need page > 1 but don't have the cursor, walk forward from page 1
      if (page > 1 && !prevLastDoc) {
        // Recursively load all previous pages to build the cache
        for (let p = 1; p < page; p++) {
          if (!pageCacheRef.current[p]) {
            const cursorDoc =
              p > 1 ? pageCacheRef.current[p - 1]?.lastDoc : null;
            const r = await getJobs({
              category: filters.category || undefined,
              location: filters.location || undefined,
              contractType: filters.contractType || undefined,
              salaryRange: filters.salaryRange || undefined,
              lastDoc: cursorDoc || null,
            });
            pageCacheRef.current[p] = { jobs: r.jobs, lastDoc: r.lastVisible };
          }
        }
      }

      const cursor = page > 1 ? pageCacheRef.current[page - 1]?.lastDoc : null;

      const result = await getJobs({
        category: filters.category || undefined,
        location: filters.location || undefined,
        contractType: filters.contractType || undefined,
        salaryRange: filters.salaryRange || undefined,
        lastDoc: cursor || null,
      });

      pageCacheRef.current[page] = {
        jobs: result.jobs,
        lastDoc: result.lastVisible,
      };

      const displayed = filters.vacantOnly
        ? result.jobs.filter((j) => j.isVacant)
        : result.jobs;

      setJobs(displayed);

      // Update total count estimate
      if (result.jobs.length < PAGE_SIZE) {
        setTotalCount((page - 1) * PAGE_SIZE + result.jobs.length);
      } else {
        setTotalCount((prev) => Math.max(prev, page * PAGE_SIZE + 1));
      }
    } catch (err) {
      console.error("Error loading jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Reset + reload when filters or search changes ────────────
  useEffect(() => {
    pageCacheRef.current = {};
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
    setTotalCount(0);
    loadPage(1, true);
  }, [filters, searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Load when page number changes (but not on filter change) ─
  useEffect(() => {
    if (currentPage === 1) return; // already handled by filter effect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPage(currentPage);
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Pagination helpers ───────────────────────────────────────
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = new Set([1, totalPages, currentPage]);
    for (
      let i = Math.max(2, currentPage - 2);
      i <= Math.min(totalPages - 1, currentPage + 2);
      i++
    ) {
      pages.add(i);
    }
    const sorted = [...pages].sort((a, b) => a - b);
    const result = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("...");
      result.push(sorted[i]);
    }
    return result;
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedSampleJobs();
      pageCacheRef.current = {};
      setCurrentPage(1);
      setTotalCount(0);
      await loadPage(1, true);
    } catch (e) {
      alert("Failed to seed: " + e.message);
    }
    setSeeding(false);
  };

  const resetFilters = () =>
    setFilters({
      category: "",
      location: "",
      contractType: "",
      salaryRange: "",
      vacantOnly: false,
    });

  const pageStart = (currentPage - 1) * PAGE_SIZE + 1;
  const pageEnd = Math.min(currentPage * PAGE_SIZE, totalCount);

  return (
    <div className="home-page">
      {/* Hero */}
      <div className="hero">
        <div className="hero-inner">
          <h1>Find Your Healthcare Career in the UK</h1>
          <p>
            Browse {totalCount > 0 ? `${totalCount}+` : "thousands of"} care &
            healthcare jobs across the United Kingdom
          </p>
          <form
            className="hero-search"
            onSubmit={(e) => {
              e.preventDefault();
              const v = e.target.q.value.trim();
              if (v) setSearchParams({ search: v });
              else setSearchParams({});
            }}
          >
            <div className="hero-search-box">
              <Search size={20} className="search-icon" />
              <input
                name="q"
                type="text"
                defaultValue={searchQuery}
                placeholder="Job title, keyword or company..."
              />
            </div>
            <button type="submit" className="hero-search-btn">
              Search Jobs
            </button>
          </form>
        </div>
      </div>

      {/* Category pills — must match seed categories exactly */}
      <div className="category-strip">
        <div className="category-strip-inner">
          {[
            "Care Assistant",
            "Support Worker",
            "Senior Carer",
            "Healthcare Assistant",
            "Nurse",
            "Mental Health Support",
            "Domiciliary Care",
            "Live-in Care",
            "Nursery Nurse",
            "Social Worker",
            "Occupational Therapist",
            "Physiotherapist",
          ].map((cat) => (
            <button
              key={cat}
              className={`cat-pill ${filters.category === cat ? "active" : ""}`}
              onClick={() =>
                setFilters((p) => ({
                  ...p,
                  category: p.category === cat ? "" : cat,
                }))
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
   <TrustedCompanies />

      {/* Main content */}
      <div className="main-layout">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          onReset={resetFilters}
        />

        <div className="jobs-column">
          <div className="jobs-header">
            <div>
              {searchQuery ? (
                <h2>
                  Results for "<em>{searchQuery}</em>"
                </h2>
              ) : (
                <h2>
                  {filters.category || "All Healthcare Jobs"}{" "}
                  <span className="results-count">in the UK</span>
                </h2>
              )}
              <p className="results-subtitle">
                {totalCount > 0 && !searchQuery
                  ? `Showing ${pageStart}–${pageEnd} of ${totalCount} positions`
                  : `${totalCount} ${totalCount === 1 ? "position" : "positions"} found`}
              </p>
            </div>
            <button
              className="seed-btn"
              onClick={handleSeed}
              disabled={seeding}
              title="Load sample data"
            >
              {seeding ? (
                <Loader2 size={14} className="spin" />
              ) : (
                <Database size={14} />
              )}
              {seeding ? "Loading..." : "Load Sample Jobs"}
            </button>
          </div>

          {loading ? (
            <div className="loading-state">
              <Loader2 size={32} className="spin" />
              <p>Finding jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <p>
                No jobs found. Try adjusting your filters or{" "}
                <button onClick={resetFilters} className="link-btn">
                  clear all filters
                </button>
                .
              </p>
              <p className="empty-hint">
                You can also click "Load Sample Jobs" above to populate some
                demo data.
              </p>
            </div>
          ) : (
            <div className="jobs-list">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && !searchQuery && totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn pagination-arrow"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
                <span>Prev</span>
              </button>

              <div className="pagination-pages">
                {getPageNumbers().map((p, i) =>
                  p === "..." ? (
                    <span key={`ellipsis-${i}`} className="pagination-ellipsis">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      className={`pagination-btn pagination-page ${currentPage === p ? "active" : ""}`}
                      onClick={() => goToPage(p)}
                      aria-label={`Page ${p}`}
                      aria-current={currentPage === p ? "page" : undefined}
                    >
                      {p}
                    </button>
                  ),
                )}
              </div>

              <button
                className="pagination-btn pagination-arrow"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
         <CareerServicesSection />
    </div>
  );
}
