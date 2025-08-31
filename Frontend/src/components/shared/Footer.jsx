export default function Footer() {
  return (
    <footer className="border-t border-neutral-200/70 dark:border-neutral-800/70">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-500">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} DeSchol. All rights reserved.</p>
         
        </div>
      </div>
    </footer>
  )
}
