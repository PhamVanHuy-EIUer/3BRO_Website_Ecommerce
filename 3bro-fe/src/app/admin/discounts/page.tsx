import DiscountManagement from "@/components/admin/discounts/DiscountTable";

const DiscountPage = () => {
  return (
    <div className="flex-1 relative z-10">
      <main className="max-w-8xl mx-auto py-6 px-4 lg:px-8">
        <div
          style={{
            opacity: 1,
            transform: "translateY(0)",
            transition: "opacity 1s ease, transform 1s ease",
          }}
        >
          <DiscountManagement />
        </div>
      </main>
    </div>
  );
};

export default DiscountPage;
