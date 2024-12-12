
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Dashboard from "@/components/Dashboard/page";

export const metadata: Metadata = {
  title: "Next.js Stocks Dashboard | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Stocks Dashboard page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const StocksPage = () => {
  return (
    <DefaultLayout>
      <Dashboard />
    </DefaultLayout>
  );
};

export default StocksPage;
