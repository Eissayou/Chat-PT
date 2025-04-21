import { Form, Input, Button } from "antd";
import useUserData from "@/store/userData";

export default function SignUp() {

  const onFinish = (values) => {
    console.log("Registered:", values);
    // Handle sign-up logic here
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const userData = useUserData();

  const fields = [
    { label: "Height", name: "height", valueKey: "height", setterKey: "setHeight", message: "Please input your height!" },
    { label: "Weight", name: "weight", valueKey: "weight", setterKey: "setWeight", message: "Please input your weight!" },
    { label: "Age", name: "age", valueKey: "age", setterKey: "setAge", message: "Please input your age!" },
  ];

  return (
    <>
        <h2>Sign Up</h2>
        <Form
            name="signupForm"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            >
            <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: "Please enter a username!" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter a password!" }]}
            >
                <Input.Password />
            </Form.Item>

            {fields.map((field) => (
                <Form.Item
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    rules={[{ required: true, message: field.message }]}
                >
                    <Input
                        onChange={(e) => userData[field.setterKey](e.target.value)}
                    />
                </Form.Item>
            ))}
        </Form>
        <Button type="primary" htmlType="submit" block>
                Sign Up
        </Button>
    </>
  );
}
