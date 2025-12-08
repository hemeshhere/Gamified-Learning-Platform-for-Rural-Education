export default function BadgePopup({ badges }) {
  return (
    <div className="fixed left-6 bottom-6 bg-white border p-4 rounded shadow-lg w-72">
      <h3 className="font-semibold mb-2">New Badges Earned!</h3>

      <ul className="space-y-2">
        {badges.map((b, i) => (
          <li key={i} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-yellow-300 flex items-center justify-center text-xl">
              🏅
            </div>
            <span className="font-medium">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
