import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <div className={styles.footer}>
      <ul>
        <li>
          <a
            href="mailto:fmovieshelp@gmail.com"
            style={{ cursor: "pointer", color: "inherit", textDecoration: "none" }}
          >
            Contact Us
          </a>
        </li>
      </ul>
    </div>
  );
}
