import React from "react";
import { Form, Link, ActionFunctionArgs } from "react-router-dom";
import { FormInput, SubmitBtn } from "../components";
import { MdEmail } from "react-icons/md";
import { toast } from "react-toastify";
import { FaKey, FaGoogle, FaUser } from "react-icons/fa";
import { customFetch } from "../utils";

export const action = async ({ request }: ActionFunctionArgs): Promise<null> => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData) as Record<string, string>;

  try {
    const response = await customFetch.post("/auth/register", data);
    toast.success(response?.data?.msg);
    return null;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { msg?: string } } };
    const errorMessage = err?.response?.data?.msg || "An error occurred";
    toast.error(errorMessage);
    return null;
  }
};

const Register: React.FC = () => {
  const handleGoogleSignIn = (): void => {
    window.location.href = "http://localhost:5000/api/v1/auth/google"; // TODO: Replace with production link
  };

  return (
    <section className="h-screen grid place-items-center">
      <Form
        className="card bg-base-300 w-96 shadow-xl hover:shadow-2xl duration-300"
        method="post"
      >
        <div className="card-body items-center">
          <h2 className="card-title text-2xl pb-4">Register</h2>

          <FormInput name="name" type="text" label="Name" Icon={FaUser} />
          <FormInput name="email" type="email" label="Email" Icon={MdEmail} />
          <FormInput name="password" type="password" label="Password" Icon={FaKey} />

          <Link
            to="/login"
            className="text-primary hover:underline flex justify-end w-full pr-2 mt-[-0.3rem] font-medium"
          >
            Login
          </Link>

          <SubmitBtn text="Register" />

          <button
            type="button"
            className="btn btn-neutral btn-block mt-2"
            onClick={handleGoogleSignIn}
          >
            <FaGoogle />
            Sign in With Google
          </button>
        </div>
      </Form>
    </section>
  );
};

export default Register;
