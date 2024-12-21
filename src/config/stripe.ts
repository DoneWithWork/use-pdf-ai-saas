export const PLANS = [
  {
    name: "Free",
    slug: "free",
    quota: 2,

    price: {
      amount: 0,
      priceIds: {
        test: "",
        production: "",
      },
    },
  },
  {
    name: "Pro",
    slug: "pro",
    quota: 100,
    pagesPerPdf: 100,
    price: {
      amount: 14,
      priceIds: {
        test: "price_1QR9rz051qkB6Ei3jjmD4WD9",
        production: "",
      },
    },
  },
  {
    name: "Student",
    slug: "student",
    quota: 25,
    pagesPerPdf: 25,
    price: {
      amount: 5,
      priceIds: {
        test: "price_1QR9rz051qkB6Ei3jjmD4WD9",
        production: "",
      },
    },
  },
];
