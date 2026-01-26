import { Button, Result } from "antd";
import Link from "next/link";

const ForbiddenPage = () => {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Link
          href="/"
          className="px-4 py-2 bg-[#1554ad]! text-white! rounded-md! hover:bg-[#1554ad]/80! transition-all! duration-300!"
        >
          Back Home
        </Link>
      }
    />
  );
};

export default ForbiddenPage;
