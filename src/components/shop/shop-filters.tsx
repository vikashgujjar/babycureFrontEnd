"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { useQueryParams } from "@/lib/hooks/use-query-params";
import type { Attribute, Brand, Category, Collection } from "@/lib/types";

interface ShopFiltersProps {
  categories: Category[];
  brands: Brand[];
  collections: Collection[];
  attributes: Attribute[];
  resultCount: number;
  /** Category Listing pages scope category_id via the route itself — showing
   * a redundant category selector there would let users "escape" the page
   * they're on rather than filter within it. */
  showCategoryFilter?: boolean;
}

function RadioGroup({
  label,
  paramKey,
  options,
  current,
  onChange,
}: {
  label: string;
  paramKey: string;
  options: { id: number; name: string }[];
  current: string | null;
  onChange: (value: string | null) => void;
}) {
  return (
    <AccordionItem question={label} defaultOpen>
      <div className="flex flex-col gap-2.5">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink">
          <input
            type="radio"
            name={paramKey}
            checked={!current}
            onChange={() => onChange(null)}
            className="size-4 accent-primary"
          />
          All
        </label>
        {options.map((option) => (
          <label key={option.id} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink">
            <input
              type="radio"
              name={paramKey}
              checked={current === String(option.id)}
              onChange={() => onChange(String(option.id))}
              className="size-4 accent-primary"
            />
            {option.name}
          </label>
        ))}
      </div>
    </AccordionItem>
  );
}

function FilterContent({
  categories,
  brands,
  collections,
  attributes,
  showCategoryFilter = true,
}: ShopFiltersProps) {
  const { get, getAll, set, toggleInList, clear } = useQueryParams();

  const [minPrice, setMinPrice] = useState(get("min_price") ?? "");
  const [maxPrice, setMaxPrice] = useState(get("max_price") ?? "");

  const selectedAttributeValues = getAll("attribute_value_ids");

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between pb-4">
        <h2 className="font-display text-lg text-ink">Filters</h2>
        <button onClick={clear} className="text-xs font-medium text-primary underline-offset-4 hover:underline">
          Clear all
        </button>
      </div>

      <Accordion>
        <AccordionItem question="Availability" defaultOpen>
          <Checkbox
            label="In stock only"
            checked={get("in_stock") === "1"}
            onChange={(event) => set({ in_stock: event.target.checked ? "1" : null })}
          />
        </AccordionItem>

        <AccordionItem question="Price" defaultOpen>
          <form
            className="flex items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              set({ min_price: minPrice || null, max_price: maxPrice || null });
            }}
          >
            <Input
              type="number"
              min={0}
              placeholder="Min"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              className="h-9"
            />
            <span className="text-ink-soft">–</span>
            <Input
              type="number"
              min={0}
              placeholder="Max"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              className="h-9"
            />
            <Button type="submit" size="sm" variant="outline">
              Go
            </Button>
          </form>
        </AccordionItem>

        {showCategoryFilter && (
          <RadioGroup
            label="Category"
            paramKey="category_id"
            options={categories}
            current={get("category_id")}
            onChange={(value) => set({ category_id: value })}
          />
        )}

        <RadioGroup
          label="Brand"
          paramKey="brand_id"
          options={brands}
          current={get("brand_id")}
          onChange={(value) => set({ brand_id: value })}
        />

        {collections.length > 0 && (
          <RadioGroup
            label="Collection"
            paramKey="collection_id"
            options={collections}
            current={get("collection_id")}
            onChange={(value) => set({ collection_id: value })}
          />
        )}

        {attributes.map((attribute) => (
          <AccordionItem key={attribute.id} question={attribute.name} defaultOpen>
            <div className="flex flex-col gap-2.5">
              {attribute.values.map((value) => (
                <Checkbox
                  key={value.id}
                  label={value.value}
                  checked={selectedAttributeValues.includes(String(value.id))}
                  onChange={() => toggleInList("attribute_value_ids", String(value.id))}
                />
              ))}
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export function ShopFilters(props: ShopFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink lg:hidden"
      >
        <SlidersHorizontal className="size-4" /> Filters
      </button>

      <aside className="hidden w-64 shrink-0 lg:block">
        <FilterContent {...props} />
      </aside>

      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} title="Filters" side="left">
        <div className="px-6 py-4">
          <FilterContent {...props} />
        </div>
        <div className="border-t border-line p-4">
          <Button onClick={() => setMobileOpen(false)} className="w-full">
            Show {props.resultCount} results
          </Button>
        </div>
      </Drawer>
    </>
  );
}
