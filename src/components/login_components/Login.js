import { Form, Input, Button } from "antd";

export default function Login() {

  const onFinish = (values) => {
    console.log("Success:", values);
    // Handle login logic here
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
        <h2>Log In</h2>
        <Form
            name="loginForm"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            style={{ maxWidth: 300, margin: "2rem auto" }}
        >
            <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: "Please enter your username!" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter your password!" }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                Submit
                </Button>
            </Form.Item>
        </Form>
    </>
  );
}
