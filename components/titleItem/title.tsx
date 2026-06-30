import { ITitle } from "@/interfaces/title.interface";

export default function Title({ label, mainTitle, subtitle }: ITitle) {
  return (
    <div className="py-12 text-center">
      {/* Label */}
      <div className="mb-4 flex items-center justify-center gap-3">
        <span className="h-px w-10 bg-green-700 dark:bg-green-500" />
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-700 dark:text-green-400">
          {label}
        </p>
        <span className="h-px w-10 bg-green-700 dark:bg-green-500" />
      </div>

      {/* Title */}
      <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
        {mainTitle}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-400">
          {subtitle}
        </p>
      )}

      {/* Divider */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <div className="h-1 w-16 rounded-full bg-green-700 dark:bg-green-500" />
        <div className="h-2 w-2 rounded-full bg-green-700 dark:bg-green-500" />
        <div className="h-px w-16 bg-green-300 dark:bg-green-800" />
      </div>
    </div>
  );
}
