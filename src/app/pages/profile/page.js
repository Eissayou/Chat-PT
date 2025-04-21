"use client"
import styles from "./profile.module.css";
import UserInfo from "@/components/profile_components/userInfo";
import Goals from "@/components/profile_components/goals";
import { useState } from "react";
import { Form, Input, Button } from "antd";
import useUserData from "@/store/userData";

export default function Profile() {
  const [isEditing, setIsEditting] = useState(false);
  const userData = useUserData();
  const hasHydrated = useUserData((state) => state.hasHydrated);

  if (!hasHydrated) {
    return <div>Loading...</div>;
  }

  const fields = [
    { label: "Height", name: "height", valueKey: "height", setterKey: "setHeight", message: "Please input your height!" },
    { label: "Weight", name: "weight", valueKey: "weight", setterKey: "setWeight", message: "Please input your weight!" },
    { label: "Age", name: "age", valueKey: "age", setterKey: "setAge", message: "Please input your age!" },
    { label: "Bench Press", name: "bench", valueKey: "bench", setterKey: "setBench", message: "Please input your bench press!" },
    { label: "Squat", name: "squat", valueKey: "squat", setterKey: "setSquat", message: "Please input your squat!" },
    { label: "Deadlift", name: "deadlift", valueKey: "deadlift", setterKey: "setDeadlift", message: "Please input your deadlift!" },
    { label: "Mile Time", name: "mileTime", valueKey: "mileTime", setterKey: "setMileTime", message: "Please input your mile time!" },
  ];

  const onFinish = () => {
    console.log("Saved changes!");
    setIsEditting(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className={styles.profileContainer}>
      {/* Profile Header Section */}
      <div className={styles.profileHeader}>
        <img 
          src="/profile.png" 
          alt="Profile" 
          className={styles.profileImage}
        />
        <div className={styles.profileInfo}>
          <h1>{userData.username || "User"}</h1>
          <p>Member since {new Date().toLocaleDateString()}</p>
          <p>Fitness Level: Intermediate</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className={styles.profileStats}>
        <div className={styles.statCard}>
          <h3>Workouts Completed</h3>
          <p>0</p>
        </div>
        <div className={styles.statCard}>
          <h3>Meals Tracked</h3>
          <p>0</p>
        </div>
        <div className={styles.statCard}>
          <h3>Current Streak</h3>
          <p>0 days</p>
        </div>
      </div>

      {/* Biometrics Section */}
      <div className={styles.section}>
        <h2>Biometrics</h2>
        <Form
          name="biometricsForm"
          className={styles.formGrid}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          {fields.map((field) => (
            <div key={field.name} className={styles.formItem}>
              <label>{field.label}</label>
              <Input
                defaultValue={userData[field.valueKey]}
                disabled={!isEditing}
                onChange={(e) => {
                  const value = e.target.value;
                  userData[field.setterKey](value);
                }}
              />
            </div>
          ))}

          <div className={styles.buttonGroup}>
            {isEditing ? (
              <>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  className={styles.saveButton}
                >
                  Save Changes
                </Button>
                <Button 
                  onClick={() => setIsEditting(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setIsEditting(true)}
                className={styles.editButton}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </Form>
      </div>

      {/* Goals Section */}
      <div className={styles.section}>
        <h2>Fitness Goals</h2>
        <Goals />
      </div>

      {/* Progress Section */}
      <div className={styles.section}>
        <h2>Progress</h2>
        <UserInfo />
      </div>
    </div>
  );
}

