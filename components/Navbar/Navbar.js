"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./Navbar.module.css";
import search_icon from "../../public/assets/search_icon.svg";
import logo from "../../public/assets/logo.png";

export default function Navbar() {
  const navRef = useRef();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!navRef.current) return;
      if (window.scrollY >= 80) {
        navRef.current.classList.add(styles.navDark);
      } else {
        navRef.current.classList.remove(styles.navDark);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigate = (path) => {
    router.push(path);
    setMenuOpen(false);
  };

  return (
    <div className={styles.navbar} ref={navRef}>
      {menuOpen && (
        <div className={styles.menuOverlay} onClick={() => setMenuOpen(false)} />
      )}
      <div className={styles.navbarLeft}>
        {/* Hamburger — mobile only */}
        <div
          className={menuOpen ? `${styles.hamburger} ${styles.active}` : styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </div>

        <Image
          src={logo}
          alt="Watchio logo"
          width={90}
          height={32}
          onClick={() => navigate("/")}
          className={styles.logo}
          style={{ cursor: "pointer", objectFit: "contain" }}
        />

        <ul className={menuOpen ? `${styles.navbarMenu} ${styles.active}` : styles.navbarMenu}>
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("/browse/tv?category=popular")}>TV Shows</li>
          <li onClick={() => navigate("/browse/movies?category=popular")}>Movies</li>
          <li onClick={() => navigate("/browse/movies?category=now_playing")}>New &amp; Popular</li>
        </ul>

        {/* Profile icon — mobile only */}
        <button className={styles.profileBtn} onClick={() => navigate("/search")} aria-label="Profile">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </button>
      </div>

      <div className={styles.navbarRight}>
        <Image
          src={search_icon}
          alt="search"
          width={20}
          height={20}
          className={styles.searchIcon}
          onClick={() => navigate("/search")}
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
}
