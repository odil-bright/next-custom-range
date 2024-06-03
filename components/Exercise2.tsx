"use client";

import { useContext, useEffect, useState } from "react";
import Range from "../components/Range";
import ApiOperationsContext from "../context/ApiOperationsContext";

const Exercise2 = () => {
  const [data, setData] = useState([]);

  const { operations } = useContext(ApiOperationsContext);

  useEffect(() => {
    operations.getPriceSteps().then((result) => {
      if (result && result.steps) {
        setData(result.steps);
      } else {
        throw new Error(result.statusText);
      }
    });
  }, []);

  return (
    <>
      <h1>Steps Range</h1>
      {data.length > 0 && (
        <Range min={data[0]} max={data?.[data.length - 1]} steps={data} />
      )}
    </>
  );
};

export default Exercise2;
