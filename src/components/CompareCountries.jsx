import { useSelector, useDispatch } from "react-redux";
import { clearComparison, setComparing } from "../store/compareSlice.store";
import { useState, useEffect } from "react";

/**
 * Modal component for comparing selected countries
 * Displays a table of metrics for side-by-side country comparison
 */
export default function CompareCountries() {
  const { countries, isComparing } = useSelector((state) => state.compare);
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isComparing) {
      setIsVisible(true);
    }
  }, [isComparing]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      dispatch(setComparing(false));
    }, 300);
  };

  if (!isComparing) return null;

  /**
   * Metrics configuration for country comparison
   * Each metric defines its label, data key, and optional format function
   */
  const metrics = [
    {
      label: "Population",
      key: "population",
      format: (val) => val.toLocaleString(),
    },
    {
      label: "Area",
      key: "area",
      format: (val) => `${val.toLocaleString()} km²`,
    },
    { label: "Region", key: "region" },
    { label: "Subregion", key: "subregion" },
    {
      label: "Capital",
      key: "capital",
      format: (val) => val?.join(", ") || "N/A",
    },
    {
      label: "Languages",
      key: "languages",
      format: (val) => (val ? Object.values(val).join(", ") : "N/A"),
    },
    {
      label: "Currencies",
      key: "currencies",
      format: (val) =>
        val
          ? Object.values(val)
              .map((curr) => `${curr.name} (${curr.symbol})`)
              .join(", ")
          : "N/A",
    },
    {
      label: "Time Zones",
      key: "timezones",
      format: (val) => val?.join(", ") || "N/A",
    },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-30 backdrop-blur-sm transition-all duration-300 ease-in-out
          ${
            isVisible
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        onClick={handleClose}
      />

      <div
        className={`fixed inset-0 z-40 flex items-center justify-center p-2 sm:p-4 transition-all duration-300 ease-in-out
          ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
      >
        <div
          className={`bg-white dark:bg-gray-800 rounded-lg w-full max-h-[95vh] overflow-y-auto
          transform transition-all duration-300 ease-out animate-[slideDown_0.3s_ease-out] ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <div className="p-3 sm:p-6">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">
                Compare Countries
              </h2>
              <button
                onClick={handleClose}
                className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm sm:text-base">
                <thead>
                  <tr className="text-left">
                    <th className="p-2 sm:p-4 border-b dark:border-gray-700 w-1/4">
                      Metrics
                    </th>
                    {countries.map((country) => (
                      <th
                        key={country.cca3}
                        className="p-2 sm:p-4 border-b dark:border-gray-700"
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="w-24 h-16 sm:w-48 sm:h-32 mb-2 sm:mb-3">
                            <img
                              src={country.flags.svg}
                              alt={`Flag of ${country.name.common}`}
                              className="w-full h-full object-cover rounded shadow-sm"
                            />
                          </div>
                          <span className="font-semibold text-base sm:text-lg">
                            {country.name.common}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                            {country.name.official}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {metrics.map(({ label, key, format = (val) => val }) => (
                    <tr
                      key={key}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="p-2 sm:p-4 border-b dark:border-gray-700 font-medium">
                        {label}
                      </td>
                      {countries.map((country) => (
                        <td
                          key={country.cca3}
                          className="p-2 sm:p-4 border-b dark:border-gray-700 text-center"
                        >
                          {format(country[key])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 sm:mt-6 flex justify-end">
              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(() => {
                    dispatch(clearComparison());
                  }, 300);
                }}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500 text-white text-sm sm:text-base rounded-lg hover:bg-red-600 transition-colors"
              >
                Clear Comparison
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
