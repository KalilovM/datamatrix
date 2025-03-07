import { useAggregationStore } from "../store";
import PackInput from "./PackInput";

const PackInputsList = () => {
  const { pages, currentPage } = useAggregationStore();

  if (!pages[currentPage]) return null;

  return (
    <div className="flex flex-col gap-2">
      {pages[currentPage].packValues.map((value, index) => (
        <PackInput key={index} index={index} value={value} />
      ))}
    </div>
  );
};

export default PackInputsList;
