export const LEGAL_DOCS = {
  privacy: "privacy",
  terms: "terms",
  "content-rules": "contentRules",
  "delete-account": "deleteAccount",
  support: "support",
} as const;

export type LegalSlug = keyof typeof LEGAL_DOCS;
export type LegalKey = (typeof LEGAL_DOCS)[LegalSlug];
export const LEGAL_SLUGS = Object.keys(LEGAL_DOCS) as LegalSlug[];
