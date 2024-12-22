export const PLANS: PlanType[] = [
  {
    name: "Free",
    slug: "free",
    quota: 2,
    size: 4,
    workspaces: 1,
    questions: 10,
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
    quota: 200,
    size: 64,
    questions: 1000,
    workspaces: 1000,
    pagesPerPDF: 100,
    price: {
      amount: 10,
      priceIds: {
        test: "price_1QR9rz051qkB6Ei3jjmD4WD9",
        production: "",
      },
    },
  },
  {
    name: "Student",
    slug: "student",
    size: 16,
    questions: 100,
    workspaces: 50,
    quota: 50,
    pagesPerPDF: 50,
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
  size: number;
  slug: string;
  workspaces: number;
  quota: number;
  questions: number;
  pagesPerPDF: number;
  price: {
    amount: number;
    priceIds: {
      test: string;
      production: string;
    };
  };
};
