import { Form, useNavigate, useNavigation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useState } from "react";
import { customFetch } from "../utils";
import { setUser } from "../features/userSlice";
import { SubmitBtn } from "../components";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const isSubmitting = navigation.state === "submitting";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const toastId = toast.loading("Logging in...");

    try {
      const response = await customFetch.post("/auth/login", {
        email,
        password,
      });

      dispatch(setUser(response.data.user));
      toast.update(toastId, {
        render: "Login successful",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      navigate("/profile");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.msg || "Login failed. Please try again.";
      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="align-element h-screen flex justify-center items-center">
      <div className="card w-full max-w-md shadow-lg p-8 bg-base-100">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input input-bordered"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <SubmitBtn text="Login" />
        </Form>
      </div>
    </div>
  );
};

export default Login;
