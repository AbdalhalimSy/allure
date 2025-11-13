export default function TalentList() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Talents</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Placeholder talent cards */}
        {[1,2,3,4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded shadow p-4 flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mb-2" />
            <span className="font-medium">Talent {i}</span>
            <span className="text-xs text-gray-500">Model</span>
          </div>
        ))}
      </div>
    </div>
  );
}
