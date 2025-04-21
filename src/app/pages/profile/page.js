"use client"
import styles from "../../page.module.css";
import UserInfo from "@/components/profile_components/userInfo";
import Biometrics from "@/components/profile_components/biometrics";
import useUserData from "@/store/userData";
import Goals from "@/components/profile_components/goals";

export default function Profile() {

    const userData = useUserData();

    return (
        <div className={styles.page}>
            <h2>Welcome Back {userData.username}!</h2>
            <main className={styles.main}>
                <UserInfo />
                <Goals />
                <Biometrics />
            </main>
        </div>
    )
  }