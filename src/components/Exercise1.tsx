import Range from "@/components/Range";
import { apiOperations } from "@/services/priceData";

const Exercise1 = async () => {
  const { range: data } = await apiOperations.getPriceRange();

  return <Range min={data[0]} max={data[1]} />;
};

export default Exercise1;
