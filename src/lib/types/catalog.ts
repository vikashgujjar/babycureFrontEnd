export interface Seo {
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  canonical_url?: string | null;
  robots?: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_id?: number | null;
  og_image?: string | null;
  twitter_title?: string | null;
  twitter_description?: string | null;
  twitter_image_id?: number | null;
  twitter_image?: string | null;
  schema?: Record<string, unknown> | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  parent_name?: string | null;
  description: string | null;
  status: "active" | "inactive";
  show_in_menu: boolean;
  sort_order: number;
  image: string | null;
  children?: Category[];
  seo?: Seo | null;
  created_at: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  website_url: string | null;
  status: "active" | "inactive";
  sort_order: number;
  logo: string | null;
  created_at: string;
}

export interface Collection {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  status: "active" | "inactive";
  sort_order: number;
  image: string | null;
  seo?: Seo | null;
  created_at: string;
}

export interface AttributeValue {
  attribute_id: number;
  attribute_name: string;
  attribute_value_id: number;
  value: string;
  color_code: string | null;
}

export interface VariantAttributeValue {
  attribute_id: number;
  attribute_value_id: number;
  value: string;
  color_code: string | null;
}

export interface ProductVariant {
  id: number;
  sku: string;
  barcode: string | null;
  label: string;
  price: string | null;
  discount_price: string | null;
  effective_price: number;
  stock_quantity: number;
  weight: string | null;
  dimensions: {
    length_cm: string | null;
    width_cm: string | null;
    height_cm: string | null;
  };
  video_url: string | null;
  status: "active" | "inactive";
  primary_image: string | null;
  hover_image: string | null;
  gallery: string[];
  attribute_values: VariantAttributeValue[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  barcode: string | null;
  category: { id: number; name: string; slug: string } | null;
  brand: { id: number; name: string; slug: string } | null;
  short_description: string | null;
  description: string | null;
  price: string;
  discount_price: string | null;
  effective_price: number;
  weight: string | null;
  dimensions: {
    length_cm: string | null;
    width_cm: string | null;
    height_cm: string | null;
  };
  hsn_code: string | null;
  gst_percentage: string | null;
  stock_quantity: number;
  manage_stock: boolean;
  in_stock: boolean;
  low_stock: boolean;
  status: "draft" | "published" | "archived";
  flags: {
    is_featured: boolean;
    is_best_seller: boolean;
    is_new_arrival: boolean;
    is_trending: boolean;
    is_flash_sale: boolean;
    is_coming_soon: boolean;
    is_pre_order: boolean;
  };
  featured_image: string | null;
  gallery: string[];
  attribute_values?: AttributeValue[];
  variants: ProductVariant[];
  collections?: Record<string, string>;
  view_count: number;
  rating_average: number | null;
  review_count: number;
  created_at: string;
  seo?: Seo | null;
}

export interface ProductFilters {
  term?: string;
  category_id?: number;
  brand_id?: number;
  collection_id?: number;
  min_price?: number;
  max_price?: number;
  attribute_value_ids?: number[];
  in_stock?: boolean;
  sort_by?: "created_at" | "price" | "name";
  sort_dir?: "asc" | "desc";
  page?: number;
}

export interface Attribute {
  id: number;
  name: string;
  slug: string;
  type: "select" | "color" | "text" | "number";
  is_variant: boolean;
  is_filterable: boolean;
  values: { id: number; value: string; slug: string; color_code: string | null }[];
}

export interface Review {
  id: number;
  customer_name: string | null;
  product_id: number;
  rating: number;
  title: string | null;
  comment: string | null;
  is_verified_purchase: boolean;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}
