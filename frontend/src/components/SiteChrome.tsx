"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Shows the public Navbar / Footer everywhere except inside the admin panel. */
export default function SiteChrome({
  nav,
  footer,
  children,
}: {
  nav: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const inAdmin = usePathname()?.startsWith("/admin");
  return (
    <>
      {!inAdmin && nav}
      <main id="main-content">{children}</main>
      {!inAdmin && footer}
    </>
  );
}
