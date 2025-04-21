'use client';
import styles from './Sidebar.module.css';
// import profilePic from '../../public/profile.svg'; // Make sure this file exists
async function Logout() {
  localStorage.clear()
  const response = await fetch('/api/HandleLogout', {
    method: 'POST',
});
}
export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <img 
        src="/profile.png"
        alt="App Logo" 
        style={{ width: '60%', height: 'auto', marginBottom: '1rem', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} 
      />
      <a href="/pages/profile" className={styles.link}>Profile</a>
      <a href="/pages/mealplan" className={styles.link}>Meal Plans</a>
      <a href="/pages/workoutplan" className={styles.link}>Workout Plans</a>
      <a href="/pages/userchat" className={styles.link}>Personal Trainer Chat</a>
      <a href="/pages/videocheck" className={styles.link}>Video Form Critique</a>
      <a href="/pages/login" className={styles.link} onClick={Logout}>Log Out</a>
      
    </div>
  );
}
