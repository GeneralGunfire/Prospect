export function LogoCloud() {
  const institutions = [
    'UCT', 'Wits', 'Stellenbosch', 'UP', 'UKZN', 'UJ', 'NWU', 'UNISA',
    'Rhodes', 'UFH', 'UWC', 'CPUT',
  ];
  return (
    <div className="flex flex-wrap justify-center gap-6 opacity-60">
      {institutions.map((name) => (
        <span key={name} className="text-sm font-semibold text-slate-600 px-3 py-1 border border-slate-200 rounded-full">
          {name}
        </span>
      ))}
    </div>
  );
}
