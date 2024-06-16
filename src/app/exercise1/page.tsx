import Exercise1 from "@/components/Exercise1";
import { Suspense } from "react";

export default async function Page() {
  return (
    <>
      <h1>Linear Range</h1>
      <Suspense fallback={<>Loading...</>}>
        <Exercise1 />
      </Suspense>
    </>
  );
}
