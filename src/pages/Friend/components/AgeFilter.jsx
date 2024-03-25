import React from 'react'
import styles from './AgeFilter.module.css'

export default function AgeFilter() {

  return (
    <div className={styles.filterWrap}>
        <input className={styles.filter} type='range'/>
        <input className={styles.filter} type='range'/>
    </div>
  )
}
