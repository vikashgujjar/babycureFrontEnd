"use client";

import { Select } from "@/components/ui/select";
import { useQueryParams } from "@/lib/hooks/use-query-params";

const SORT_OPTIONS = [
  { value: "newest", sort_by: "created_at", sort_dir: "desc", label: "Newest" },
  { value: "price_asc", sort_by: "price", sort_dir: "asc", label: "Price: Low to High" },
  { value: "price_desc", sort_by: "price", sort_dir: "desc", label: "Price: High to Low" },
  { value: "name_asc", sort_by: "name", sort_dir: "asc", label: "Name: A to Z" },
] as const;

export function SortSelect() {
  const { get, set } = useQueryParams();

  const current =
    SORT_OPTIONS.find((option) => option.sort_by === (get("sort_by") ?? "created_at") && option.sort_dir === (get("sort_dir") ?? "desc"))
      ?.value ?? "newest";

  return (
    <Select
      value={current}
      onChange={(event) => {
        const option = SORT_OPTIONS.find((o) => o.value === event.target.value);
        if (option) set({ sort_by: option.sort_by, sort_dir: option.sort_dir });
      }}
      className="w-auto min-w-44"
      aria-label="Sort products"
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
}
