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
  tee: u('photo-1521572267360-ee0c2909d518', 900),
  teeAlt: u('photo-1583743814966-8936f5b7be1a', 900),
  hoodie: u('photo-1556821840-3a63f95609a7', 900),
  hoodieAlt: u('photo-1620799139507-2a76f79a2f4d', 900),
  joggers: u('photo-1552902865-b72c031ac5ea', 900),
  joggersAlt: u('photo-1517462964-21fdcec3f25b', 900),
  gymSet: u('photo-1581009146145-b5ef050c2e1e', 900),
  gymSetAlt: u('photo-1517836357463-d25dfeac3438', 900),
  bag: u('photo-1622560480605-d83c853bc5c3', 900),
  bagAlt: u('photo-1616422285623-13ff0162193c', 900),
  tank: u('photo-1517838277536-f5f99be501cd', 900),
  tankAlt: u('photo-1508214751196-bcfd4ca60f91', 900),
  shorts: u('photo-1539185441755-769473a23570', 900),
  shortsAlt: u('photo-1508214751196-bcfd4ca60f91', 900),
  cap: u('photo-1588850561407-ed78c282e89b', 900),
  capAlt: u('photo-1521369909029-2afed882baee', 900),
  sneakers: u('photo-1542291026-7eec264c27ff', 900),
} as const;

export function productImageSet(primary: string, alt?: string) {
  return [
    { url: primary, alt: 'Product view', isPrimary: true },
    ...(alt ? [{ url: alt, alt: 'Alternate view', isPrimary: false }] : []),
  ];
}
