import Link from "next/link";
import { notFound } from "next/navigation";
import { getDriverById } from "../../actions";
import { EditDriverForm } from "./edit-form";

interface EditDriverPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Edit Driver | TransitOps",
  description: "Update driver profile details, contact info, or license parameters.",
};

export default async function EditDriverPage({ params }: EditDriverPageProps) {
  const { id } = await params;

  const result = await getDriverById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const driver = result.data;

  // Format date to YYYY-MM-DD string for input field value
  const formattedExpiry = new Date(driver.licenseExpiry)
    .toISOString()
    .split("T")[0];

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/drivers"
          className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Drivers
        </Link>
      </div>

      {/* Form */}
      <EditDriverForm
        driver={{
          id: driver.id,
          name: driver.name,
          licenseNumber: driver.licenseNumber,
          licenseCategory: driver.licenseCategory,
          licenseExpiry: formattedExpiry,
          contactNumber: driver.contactNumber,
        }}
      />
    </div>
  );
}
