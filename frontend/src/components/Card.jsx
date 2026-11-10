export default function Card({ icon: Icon, title, className = "", children }) {
  return (
    <section className={`glass rounded-2xl p-5 sm:p-6 ${className}`}>
      {title && (
        <h3 className="mb-4 flex items-center gap-2.5 font-display text-[17px] font-bold text-slate-100">
          {Icon && (
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-cyan-400/10 text-cyan-300">
              <Icon className="h-4 w-4" aria-hidden />
            </span>
          )}
          {title}
        </h3>
      )}
      {children}
    </section>
  );
}