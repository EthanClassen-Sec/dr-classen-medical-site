function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white px-6 py-10 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-slate-950">Dr. Lynette Classen</p>
          <p className="mt-1">Modern family medical practice</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <a className="hover:text-teal-700" href="#about">
            About
          </a>
          <a className="hover:text-teal-700" href="#services">
            Services
          </a>
          <a className="hover:text-teal-700" href="#booking">
            Bookings
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
