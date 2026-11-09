export default function Card({ icon: Icon, title, className = "", children }) {
  return (
    <section className={`rounded-lg border border-zinc-800 bg-zinc-900/40 p-5 ${className}`}>
      {title && (
        <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-zinc-100">
          {Icon && <Icon className="h-4 w-4 text-zinc-500" aria-hidden />}
          {title}
        </h3>
      )}
      {children}
    </section>
  );
}
