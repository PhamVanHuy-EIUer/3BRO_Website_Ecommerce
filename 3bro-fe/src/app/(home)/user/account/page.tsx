import { redirect } from "next/navigation";

export default function UserPage() {
  // Server-side redirect to /user/account
  redirect("/user/account/profile");
}
