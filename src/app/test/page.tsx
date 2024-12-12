import { columns, Payment } from "@/components/tables/columns";
import { DataTable } from "@/components/tables/data-table";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728eddw52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728edwwd52f",
      amount: 100,
      status: "processing",
      email: "m@example.com",
    },
    {
      id: "728ewwd52f",
      amount: 10,
      status: "success",
      email: "mee@example.com",
    },
  ];
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
