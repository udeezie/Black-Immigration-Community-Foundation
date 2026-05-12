import styles from './Loader.module.scss'

export default function Loader() {
  return (
    <div className={styles.overlay}>
      <div className={styles.loader}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={styles.dot} />
        ))}
      </div>
    </div>
  )
}
