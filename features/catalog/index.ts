// Views
export { LandingView } from "./views/LandingView";
export { ProductListView } from "./views/ProductListView";
export { ProductDetailView } from "./views/ProductDetailView";

// Service
export { default as catalogService } from "./service/catalog.service";
export type { ListProductsParams } from "./service/catalog.service";

// Types
export type { Product, Store } from "./types/catalog.types";
