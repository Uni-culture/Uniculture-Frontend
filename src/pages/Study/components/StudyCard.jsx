import React from 'react'
import styles from './StudyCard.module.css'

export const StudyCard = () => {
  return (
    <div className={styles.card}>
      <div className={styles.title}></div>
      <div className={styles.details}></div>
      <div className={styles.rating}></div>

    </div>
  )
}
