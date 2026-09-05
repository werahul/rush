/** Centralized royalty-free image URLs (Unsplash) — swap in Cloudinary later */

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const BRAND_IMAGES = {
  favicon:
    'https://api.dicebear.com/7.x/initials/png?seed=R&backgroundColor=0a0a0a&textColor=ffffff&fontSize=46&fontWeight=700',
  logo: u('photo-1441986300917-64674bd600d8', 400),
} as const;

export const PAGE_IMAGES = {
  hero: u('photo-1506794778202-cad84cf45f1d', 1920),
  heroAlt: u('photo-1509281373149-e957c6296406', 1920),
  auth: u('photo-1488161628813-04466f872be2', 1200),
  emptyCart: u('photo-1506152983158-b4a74a01c721', 800),
  emptyWishlist: u('photo-1558769132-cb1aea458c5e', 800),
  newsletter: u('photo-1511556532299-8f662fc26c06', 1600),
} as const;

export const CATEGORY_IMAGES: Record<string, string> = {
  'mens-wear': u('photo-1539571696357-5a69c17a67c6', 900),
  'gym-outfits': u('photo-1581009146145-b5ef050c2e1e', 900),
  accessories: u('photo-1576243345690-4e4b79b63288', 900),
};

export const PRODUCT_IMAGES = {
  tee: u('photo-1571455786673-9d9d6c194f90', 900),
  teeAlt: u('photo-1610502778270-c5c6f4c7d575', 900),
  hoodie: u('photo-1647797819874-f51a8a8fc5c0', 900),
  hoodieAlt: u('photo-1556821840-3a63f95609a7', 900),
  joggers: u('photo-1552902865-b72c031ac5ea', 900),
  joggersAlt: u('photo-1584302052177-2e90841dad6a', 900),
  gymSet: u('photo-1608217002058-2e45c33b6c2c', 900),
  gymSetAlt: u('photo-1575898311302-0d04de38c259', 900),
  bag: u('photo-1620786514684-ff35b5aae55e', 900),
  bagAlt: u('photo-1668435734515-2396649c7cb4', 900),
  tank: u('photo-1614367674345-f414b2be3e5b', 900),
  tankAlt: u('photo-1704223523303-a5ed14561b1f', 900),
  shorts: u('photo-1579758682665-53a1a614eea6', 900),
  shortsAlt: u('photo-1591741543032-bf439b4fd46c', 900),
  cap: u('photo-1737666636073-f15d9762cf83', 900),
  capAlt: u('photo-1704253801154-e7da0cafd28b', 900),
} as const;

export function productImageSet(primary: string, alt?: string) {
  return [
    { url: primary, alt: 'Product view', isPrimary: true },
    ...(alt ? [{ url: alt, alt: 'Alternate view', isPrimary: false }] : []),
  ];
}
