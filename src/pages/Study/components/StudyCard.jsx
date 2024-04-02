import React from 'react'
import styles from './StudyCard.module.css'

export const StudyCard = () => {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.title}></div>
      </div>
      <div className={styles.mid}>
        <div className={styles.method}></div>
      </div>
      <div className={styles.bot}>
        <div className={styles.creator}></div>
        <div className={styles.rating}></div>
      </div>
    </div>
  )
}
