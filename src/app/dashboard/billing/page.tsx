import BillingForm from "@/components/BillingForm";
import { getUserSubscriptionPlan } from "@/lib/stripe";

const Page = async () => {
  const subscriptionPlan = await getUserSubscriptionPlan();

  return (
    <div className="wrapper">
      <h1 className="title mt-5">Billing</h1>
      <BillingForm subscriptionPlan={subscriptionPlan} />
    </div>
  );
};

export default Page;
