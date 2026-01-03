import { redirect } from "next/navigation";

export default function LibraryPage() {
  // Redirect to user's personal library by default
  redirect("/library/my");
}
