"use client"
import styles from "../../page.module.css";
import UserInfo from "@/components/profile_components/userInfo";
import Goals from "@/components/profile_components/goals";
import { useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import useUserData from "@/store/userData";

export default function Profile() {
const [isEditing, setIsEditting] = useState(false);
const userData = useUserData();
const hasHydrated = useUserData((state) => state.hasHydrated);

if (!hasHydrated) {
return <div>Loading...</div>; // or a spinner
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
    <div className={styles.page}>
    <main className={styles.main}>
  <>
    <Form
      name="biometricsForm"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      {fields.map((field) => (
        <Form.Item
          key={field.name}
          label={field.label}
          name={field.name}
          // rules={isEditing ? [{ required: true, message: field.message }] : []}
        >
          <Input
              defaultValue={userData[field.valueKey]}
              disabled={!isEditing}
              onChange={
                (e) => 
                  {
                    const value = e.target.value
                    console.log(`attempting to change ${userData[field.valueKey]}`)
                    console.log(`with function ${userData[field.setterKey]}`)
                    userData[field.setterKey](e.target.value)
                    console.log(`New value ${userData[field.valueKey]}`)
                  }
                  }
          />
        </Form.Item>
      ))}

      {isEditing && (
        <>
          <Form.Item name="remember" valuePropName="checked" label={null}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </>
      )}
    </Form>

    <Button 
      onClick={() => setIsEditting(!isEditing)} 
      style={{ marginBottom: "1rem" }}>
          {isEditing ? "Cancel" : "Edit"}
    </Button>
  </>
</main>
</div>
)
}

