export default function ProductsLoading() {
  return (
    <div
      className="max-w-6xl mx-auto px-4 py-8"
      aria-busy="true"
      aria-label="Loading products"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="h-8 w-44 rounded bg-gray-200 animate-pulse" />
        <div className="flex flex-wrap gap-2">
          {["w-12", "w-24", "w-28", "w-20"].map((width) => (
            <div key={width} className={`h-8 ${width} rounded border bg-gray-100 animate-pulse`} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="border rounded-lg p-4">
            <div className="w-full h-48 rounded mb-4 bg-gray-200 animate-pulse" />
            <div className="h-5 w-3/4 rounded bg-gray-200 animate-pulse" />
            <div className="h-3 w-1/3 rounded bg-gray-100 animate-pulse mt-3" />
            <div className="h-4 w-full rounded bg-gray-100 animate-pulse mt-3" />
            <div className="h-5 w-1/4 rounded bg-gray-200 animate-pulse mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}