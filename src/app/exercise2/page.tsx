import { Suspense } from "react";
import Exercise2 from "@/components/Exercise2";

export default async function Page() {
  return (
    <>
      <h1>Steps Range</h1>
      <Suspense fallback={<>Loading...</>}>
        <Exercise2 />
      </Suspense>
    </>
  );
}
