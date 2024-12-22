export const PLANS: PlanType[] = [
  {
    name: "Free",
    slug: "free",
    quota: 2,
    pagesPerPDF: 5,
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
    pagesPerPDF: 100,
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
    pagesPerPDF: 25,
    price: {
      amount: 5,
      priceIds: {
        test: "price_1QYUZk051qkB6Ei34wtn2f5N",
        production: "",
      },
    },
  },
];

type PlanType = {
  name: string;
  slug: string;
  quota: number;
  pagesPerPDF: number;
  price: {
    amount: number;
    priceIds: {
      test: string;
      production: string;
    };
  };
};
