export default function TalentProfile() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col items-center py-8">
        <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full mb-4" />
        <h2 className="text-2xl font-bold mb-2">Talent Name</h2>
        <span className="text-sm text-gray-500 mb-2">Model</span>
        <p className="text-center mb-4">Biography and details go here. Skills, languages, measurements, and media gallery will be shown.</p>
        <button className="btn-primary">Apply Now</button>
      </div>
    </div>
  );
}
