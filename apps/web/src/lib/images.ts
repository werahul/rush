/** Centralized royalty-free image URLs (Unsplash) — swap in Cloudinary later */

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const BRAND_IMAGES = {
  favicon:
    'https://api.dicebear.com/7.x/initials/png?seed=R&backgroundColor=0a0a0a&textColor=ffffff&fontSize=46&fontWeight=700',
  logo: u('photo-1441986300917-64674bd600d8', 400),
} as const;

export const PAGE_IMAGES = {
  hero: u('photo-1490481651871-ab68de25d52d', 1920),
  heroAlt: u('photo-1556821840-3a63f95609a7', 1920),
  auth: u('photo-1441986300917-64674bd600d8', 1200),
  emptyCart: u('photo-1472851294608-062f824d5649', 800),
  emptyWishlist: u('photo-1523381210434-271cf293dacf', 800),
  newsletter: u('photo-1469334031218-ebb5b9654e7f', 1600),
} as const;

export const CATEGORY_IMAGES: Record<string, string> = {
  'mens-wear': u('photo-1617137968427-85924c800a22', 900),
  'gym-outfits': u('photo-1534438327276-14e5300c3a48', 900),
  accessories: u('photo-1590871190530-ac88bab5df77', 900),
};

export const PRODUCT_IMAGES = {
  tee: u('photo-1521572163474-6864f9cf17ab', 900),
  teeAlt: u('photo-1576566588028-4145f38446f2', 900),
  hoodie: u('photo-1556821840-3a63f95609a7', 900),
  hoodieAlt: u('photo-1620799140408-ed5341796eb6', 900),
  joggers: u('photo-1552902865-b72c031ac5ea', 900),
  joggersAlt: u('photo-1624378439574-d86f1668104e', 900),
  gymSet: u('photo-1571019614242-c5c5dee9f50c', 900),
  gymSetAlt: u('photo-1517836357463-d25dfeac3438', 900),
  bag: u('photo-1548036328-c9fa89d128fa', 900),
  bagAlt: u('photo-1590871190530-ac88bab5df77', 900),
  tank: u('photo-1583454110551-21f2fa2afe61', 900),
  tankAlt: u('photo-1571907480493-89303f61f3e7', 900),
  shorts: u('photo-1591195853828-11ad59ff4b9e', 900),
  shortsAlt: u('photo-1593079831168-338e9a431e6c', 900),
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
