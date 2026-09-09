import StatusBadge from '../components/StatusBadge'

const MOCK_COMPLAINTS = [
  { id: 'FS-2026-000123', user: 'a***@mail.com', issue: 'Adulteration', location: 'Pune', date: '2026-08-20', status: 'review' },
  { id: 'FS-2026-000124', user: 'p***@mail.com', issue: 'Mislabeling', location: 'Nashik', date: '2026-08-22', status: 'action' },
  { id: 'FS-2026-000125', user: 'r***@mail.com', issue: 'Expired Product', location: 'Pune', date: '2026-08-25', status: 'resolved' },
]

export default function Admin() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <p className="text-orange font-semibold text-sm mb-3">Admin</p>
      <h1 className="text-3xl font-extrabold mb-10">Platform overview</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          ['Users', '4,210'], ['Products Tracked', '12,880'], ['Complaints', '1,204'],
          ['Resolved Cases', '892'], ['Guide Views', '34,110'], ['Quiz Attempts', '25,004'],
        ].map(([label, value]) => (
          <div key={label} className="bg-white rounded-card shadow-soft border border-black/5 p-5 text-center">
            <div className="text-2xl font-extrabold">{value}</div>
            <div className="text-xs text-muted mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-card shadow-soft border border-black/5 p-6 overflow-x-auto">
        <h2 className="font-heading font-bold text-lg mb-5">Complaint management</h2>
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="text-left text-muted border-b border-black/5">
              <th className="pb-3 font-medium">Tracking ID</th>
              <th className="pb-3 font-medium">User</th>
              <th className="pb-3 font-medium">Issue</th>
              <th className="pb-3 font-medium">Location</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_COMPLAINTS.map((c) => (
              <tr key={c.id} className="border-b border-black/5 last:border-0">
                <td className="py-3 font-medium">{c.id}</td>
                <td className="py-3">{c.user}</td>
                <td className="py-3">{c.issue}</td>
                <td className="py-3">{c.location}</td>
                <td className="py-3">{c.date}</td>
                <td className="py-3"><StatusBadge status={c.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
