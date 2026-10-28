export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
};

export type SeriesVariation = {
  name: string;
  description: string;
  image: string;
};

export type Series = {
  id: string;
  legacyId?: string;
  name: string;
  description: string;
  image: string;
  coverImage?: string;
  secretImage?: string;
  katakana?: string;
  variations: SeriesVariation[];
  group: "figurines" | "accessories" | "lifestyle";
};
