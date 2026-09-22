"use client";

import { useRouter, usePathname } from "next/navigation";
import styles from "./BottomNav.module.css";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    {
      label: "Home",
      path: "/",
      icon: (active) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "#fff" : "none"} stroke={active ? "#fff" : "#888"} strokeWidth="2">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
          <path d="M9 21V12h6v9" />
        </svg>
      ),
    },
    {
      label: "Browse",
      path: "/browse/movies?category=popular",
      icon: (active) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#888"} strokeWidth="2">
          <polygon points="5,3 19,12 5,21" fill={active ? "#fff" : "none"} />
        </svg>
      ),
    },
    {
      label: "Search",
      path: "/search",
      icon: (active) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#888"} strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
      ),
    },
    {
      label: "Library",
      path: "/library",
      icon: (active) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#888"} strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
  ];

  return (
    <nav className={styles.bottomNav}>
      {items.map((item) => {
        const active = item.path ? pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path.split("?")[0])) : false;
        return (
          <button
            key={item.label}
            className={`${styles.navItem} ${active ? styles.active : ""}`}
            onClick={() => item.path && router.push(item.path)}
          >
            {item.icon(active)}
            <span>{item.label}</span>
            {active && <span className={styles.dot} />}
          </button>
        );
      })}
    </nav>
  );
}
