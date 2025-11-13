export default function CastingList() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Active Casting Calls</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Placeholder casting cards */}
        {[1,2,3].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded shadow p-4">
            <span className="font-medium">Casting {i}</span>
            <span className="block text-xs text-gray-500">Role: Model</span>
            <span className="block text-xs text-gray-500">Country: UAE</span>
            <span className="block text-xs text-gray-500">Deadline: 2025-12-01</span>
          </div>
        ))}
      </div>
    </div>
  );
}
