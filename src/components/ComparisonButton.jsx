import { useSelector, useDispatch } from "react-redux";
import { setComparing, clearComparison } from "../store/compareSlice.store";

/**
 * Floating action button for managing country comparisons
 * Shows number of selected countries and triggers comparison modal
 */
export default function ComparisonButton() {
  const dispatch = useDispatch();
  const { countries: comparedCountries } = useSelector(
    (state) => state.compare
  );

  if (comparedCountries.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-30 flex gap-2">
      <button
        onClick={() => dispatch(clearComparison())}
        className="px-4 py-3 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 
        transition-colors flex items-center"
      >
        Clear
      </button>
      <button
        onClick={() => dispatch(setComparing(true))}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 
        transition-colors flex items-center gap-2"
      >
        Compare ({comparedCountries.length})
        <span className="text-sm">Max 3</span>
      </button>
    </div>
  );
}
