import BillingForm from "@/components/billing/BillingForm";
import { getUserSubscriptionPlan } from "@/lib/stripe";

const Page = async () => {
  const subscriptionPlan = await getUserSubscriptionPlan();
  console.log(subscriptionPlan);
  return (
    <div className="wrapper">
      <h1 className="title mt-5">Billing</h1>
      <BillingForm
        subscriptionPlan={subscriptionPlan}
        paymentLink={process.env.STRIPE_MONTHLY_PLAN_LINK || ""}
      />
    </div>
  );
};

export default Page;
