import { RouteNames } from "@/models/router";
import { redirect } from "next/navigation";

export default function Page() {
  redirect(RouteNames.exercise1);
}
