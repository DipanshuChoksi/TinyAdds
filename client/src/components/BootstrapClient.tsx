"use client";

import { useEffect } from "react";

/** Loads Bootstrap's JS (dropdowns, tabs, navbar collapse) on the client. */
export default function BootstrapClient() {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  return null;
}
