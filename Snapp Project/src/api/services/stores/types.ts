export interface StoreProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  currency: string;
  url: string;
  store: string;
  inStock: boolean;
  shippingInfo?: {
    price?: number;
    time?: string;
  };
}

export interface StoreProvider {
  name: string;
  fetchProduct(url: string): Promise<StoreProduct>;
  searchProduct(query: string): Promise<StoreProduct[]>;
}

export class StoreError extends Error {
  constructor(
    message: string,
    public readonly store: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'StoreError';
  }
}