export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqCategory = {
  id: string;
  title: string;
  items: FaqItem[];
};

export const faqCategories: FaqCategory[] = [
  {
    id: "orders",
    title: "Orders & Payment",
    items: [
      {
        question: "Which payment methods do you accept?",
        answer: "We accept all major credit and debit cards, PayPal, and Google Pay. All payments are processed over an encrypted connection.",
      },
      {
        question: "How can I check the status of my order?",
        answer: "Sign in to your account and open Orders. You'll see live progress for every order, from placed to delivered.",
      },
      {
        question: "Can I change or cancel my order?",
        answer: "Orders can be changed or cancelled within one hour of being placed. Contact our support team as soon as possible and we'll take care of it.",
      },
    ],
  },
  {
    id: "shipping",
    title: "Shipping & Delivery",
    items: [
      {
        question: "How long does delivery take?",
        answer: "Most orders arrive within 3–5 business days. You'll see an estimated delivery date at checkout and in your order confirmation.",
      },
      {
        question: "Is shipping free?",
        answer: "Yes. Standard shipping is free on every order, with no minimum purchase required.",
      },
      {
        question: "Do you ship internationally?",
        answer: "We currently ship across North America. We're working on expanding to more regions soon.",
      },
    ],
  },
  {
    id: "returns",
    title: "Returns & Refunds",
    items: [
      {
        question: "What is your return policy?",
        answer: "You can return most items within 14 days of delivery, as long as they're in their original condition and packaging.",
      },
      {
        question: "When will I receive my refund?",
        answer: "Once we receive and inspect your return, refunds are issued to your original payment method within 5–7 business days.",
      },
    ],
  },
  {
    id: "products",
    title: "Products & Warranty",
    items: [
      {
        question: "Are your products genuine?",
        answer: "Absolutely. Every product is brand new, sourced from authorized distributors, and covered by the official manufacturer warranty.",
      },
      {
        question: "How do I claim warranty service?",
        answer: "Contact our support team with your order number and a description of the issue. We'll guide you through repair or replacement.",
      },
    ],
  },
];
