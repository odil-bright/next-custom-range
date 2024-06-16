import Range from "@/components/Range";
import { apiOperations } from "@/services/priceData";

const Exercise2 = async () => {
  const { steps: data } = await apiOperations.getPriceSteps();
  return <Range min={data[0]} max={data[data.length - 1]} steps={data} />;
};

export default Exercise2;
