/* First-paint loading overlay.
   
      Shows briefly on initial load, then unmounts. Its background is pinned to
      the dark token directly so it cannot flash white on a light page. */

import styles from "./Loader.module.scss";

export default function Loader() {
  return (
    <div className={styles.overlay} role="status" aria-label="Loading">
      <svg
        className={styles.pl}
        width="240"
        height="240"
        viewBox="0 0 240 240"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          className={`${styles.ring} ${styles.ringA}`}
          cx="120"
          cy="120"
          r="105"
          fill="none"
          stroke="#000"
          strokeWidth="20"
          strokeDasharray="0 660"
          strokeDashoffset="-330"
          strokeLinecap="round"
        />
        <circle
          className={`${styles.ring} ${styles.ringB}`}
          cx="120"
          cy="120"
          r="35"
          fill="none"
          stroke="#000"
          strokeWidth="20"
          strokeDasharray="0 220"
          strokeDashoffset="-110"
          strokeLinecap="round"
        />
        <circle
          className={`${styles.ring} ${styles.ringC}`}
          cx="85"
          cy="120"
          r="70"
          fill="none"
          stroke="#000"
          strokeWidth="20"
          strokeDasharray="0 440"
          strokeLinecap="round"
        />
        <circle
          className={`${styles.ring} ${styles.ringD}`}
          cx="155"
          cy="120"
          r="70"
          fill="none"
          stroke="#000"
          strokeWidth="20"
          strokeDasharray="0 440"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
