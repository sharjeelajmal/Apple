import { siteConfig } from "@/config/site";

export type LegalSection = {
  id: string;
  heading: string;
  paragraphs: string[];
};

export type LegalDocument = {
  slug: string;
  title: string;
  summary: string;
  sections: LegalSection[];
};

const { name, contact } = siteConfig;

export const legalDocuments: LegalDocument[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    summary: `Your privacy matters to us. This policy explains what information ${name} collects, how we use it, and the choices you have.`,
    sections: [
      {
        id: "information-we-collect",
        heading: "Information we collect",
        paragraphs: [
          "When you create an account or place an order, we collect details such as your name, email address, shipping address, and phone number.",
          "We also collect limited technical information, like your browser type and pages visited, to keep the store secure and improve your experience.",
        ],
      },
      {
        id: "how-we-use-information",
        heading: "How we use your information",
        paragraphs: [
          "We use your information to process orders, deliver products, provide customer support, and send order updates.",
          "With your permission, we may also send you news about products and offers. You can unsubscribe at any time.",
        ],
      },
      {
        id: "sharing",
        heading: "Sharing your information",
        paragraphs: [
          "We never sell your personal information. We share it only with trusted partners who help us run the store, such as payment processors and delivery carriers, and only as needed to serve you.",
        ],
      },
      {
        id: "security",
        heading: "Keeping your data secure",
        paragraphs: [
          "All data is transmitted over encrypted connections. Passwords are hashed and payment details are handled by certified payment providers and never stored on our servers.",
        ],
      },
      {
        id: "your-rights",
        heading: "Your rights",
        paragraphs: [
          "You can view and update your personal details from your account settings at any time. To request a copy of your data or have it deleted, contact us and we'll respond within 30 days.",
        ],
      },
      {
        id: "contact",
        heading: "Contact us",
        paragraphs: [`If you have any questions about this policy, email us at ${contact.email}.`],
      },
    ],
  },
  {
    slug: "refund-policy",
    title: "Refund Policy",
    summary: "Not quite right? We make returns simple. Here's everything you need to know about returns, exchanges, and refunds.",
    sections: [
      {
        id: "return-window",
        heading: "Return window",
        paragraphs: [
          "You can return most items within 14 days of delivery for a full refund, as long as they're undamaged and in their original packaging with all accessories.",
        ],
      },
      {
        id: "non-returnable",
        heading: "Non-returnable items",
        paragraphs: [
          "For hygiene and security reasons, opened software, gift cards, and engraved or personalized products can't be returned unless they arrive faulty.",
        ],
      },
      {
        id: "how-to-return",
        heading: "How to start a return",
        paragraphs: [
          `Email ${contact.supportEmail} with your order number and the items you'd like to return. We'll send you a prepaid shipping label and instructions.`,
        ],
      },
      {
        id: "refunds",
        heading: "Refunds",
        paragraphs: [
          "Once your return arrives and passes inspection, we'll issue a refund to your original payment method within 5–7 business days.",
        ],
      },
      {
        id: "damaged-items",
        heading: "Damaged or faulty items",
        paragraphs: [
          "If your product arrives damaged or develops a fault within the warranty period, contact us right away and we'll arrange a free repair or replacement.",
        ],
      },
    ],
  },
  {
    slug: "shipping-policy",
    title: "Shipping Policy",
    summary: "Fast, free, and fully tracked. Here's how we get your order from our store to your door.",
    sections: [
      {
        id: "processing",
        heading: "Order processing",
        paragraphs: [
          "Orders placed before 2:00 PM EST on business days are processed the same day. Orders placed after that are processed the next business day.",
        ],
      },
      {
        id: "delivery-times",
        heading: "Delivery times",
        paragraphs: [
          "Standard delivery takes 3–5 business days. Remote areas may take a little longer. Your estimated delivery date is shown at checkout.",
        ],
      },
      {
        id: "shipping-costs",
        heading: "Shipping costs",
        paragraphs: ["Standard shipping is free on all orders, with no minimum purchase required."],
      },
      {
        id: "tracking",
        heading: "Order tracking",
        paragraphs: [
          "As soon as your order ships, you'll receive a tracking link by email. You can also follow its progress from the Orders section of your account.",
        ],
      },
    ],
  },
  {
    slug: "terms-of-use",
    title: "Terms of Use",
    summary: `These terms govern your use of the ${name} website and store. By using our site, you agree to them.`,
    sections: [
      {
        id: "using-our-site",
        heading: "Using our site",
        paragraphs: [
          "You agree to use this site only for lawful purposes and in a way that doesn't harm the site or other users.",
        ],
      },
      {
        id: "accounts",
        heading: "Your account",
        paragraphs: [
          "You're responsible for keeping your account credentials secure and for all activity that happens under your account.",
        ],
      },
      {
        id: "pricing",
        heading: "Pricing & availability",
        paragraphs: [
          "We work hard to keep prices and stock accurate. If an error occurs, we'll contact you before processing your order and you may cancel it at no cost.",
        ],
      },
      {
        id: "intellectual-property",
        heading: "Intellectual property",
        paragraphs: [
          "Product names and trademarks belong to their respective owners. All other site content is owned by us and may not be copied without permission.",
        ],
      },
      {
        id: "changes",
        heading: "Changes to these terms",
        paragraphs: [
          "We may update these terms from time to time. The latest version will always be available on this page.",
        ],
      },
    ],
  },
];

export const getLegalDocument = (slug: string) => legalDocuments.find((document) => document.slug === slug);
