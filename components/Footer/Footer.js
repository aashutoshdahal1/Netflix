import Image from "next/image";
import styles from "./Footer.module.css";
import youtube_icon from "../../public/assets/youtube_icon.png";

export default function Footer() {
  return (
    <>
      <a
        href="https://www.youtube.com/@Aashucode?sub_confirmation=1"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.fixedYoutubeBtn}
        title="Subscribe to our YouTube channel"
      >
        <Image src={youtube_icon} alt="Subscribe on YouTube" width={35} height={35} />
      </a>

      <div className={styles.footer}>
        <div className={styles.footerIcons}>
          <a
            href="https://www.youtube.com/@Aashucode?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src={youtube_icon} alt="YouTube" width={30} height={30} />
          </a>
        </div>
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
    </>
  );
}
