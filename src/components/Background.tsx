export default function ProfessionalBackground({
  children,
  centered = false,
  opacity = 1,
}: {
  children: React.ReactNode;
  centered?: boolean;
  opacity?: number;
}) {
  return (
    <div
      className={opacity === 1 ? "" : `opacity-${Math.round(opacity * 100)}`}
    >
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900 relative overflow-hidden">
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>

        {/* Minimal decorative elements - very subtle */}
        <div className="absolute top-20 right-20 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 left-20 w-64 h-64 bg-indigo-500/4 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-slate-500/3 rounded-full blur-xl"></div>

        {/* Professional accent lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-300/50 to-transparent"></div>
        <div className="absolute top-16 left-1/4 w-px h-32 bg-gradient-to-b from-transparent via-slate-300/30 to-transparent"></div>
        <div className="absolute bottom-20 right-1/4 w-px h-24 bg-gradient-to-t from-transparent via-slate-300/30 to-transparent"></div>

        {/* Subtle tech-inspired elements */}
        <div className="absolute top-1/4 left-10 w-3 h-3 border border-slate-400/20 rounded-sm rotate-45"></div>
        <div className="absolute top-3/4 right-16 w-2 h-2 bg-slate-400/20 rounded-full"></div>
        <div className="absolute bottom-1/3 left-1/3 w-4 h-4 border border-slate-400/15 rounded-full"></div>

        {/* Content container */}
        {centered ? (
          <div className="relative z-10 w-full flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-4xl">{children}</div>
          </div>
        ) : (
          <div className="relative z-10 w-full min-h-screen">{children}</div>
        )}
      </div>
    </div>
  );
}
