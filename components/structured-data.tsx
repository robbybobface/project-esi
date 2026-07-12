import { siteConfig } from "@/lib/metadata";
import type { ReactNode } from "react";

function jsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function StructuredData(): ReactNode {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: "Epicurean Spirits International, Inc.",
    alternateName: "Epicurean Spirits International",
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.svg`,
    email: siteConfig.contactEmail,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: siteConfig.contactEmail,
    },
    brand: [
      { "@type": "Brand", name: "La Gran Señora Tequila" },
      { "@type": "Brand", name: "Moon LIT Cove Rum" },
    ],
    sameAs: [`https://twitter.com/${siteConfig.creator.replace(/^@/, "")}`],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: { "@type": "Organization", name: siteConfig.name },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(website) }}
      />
    </>
  );
}
