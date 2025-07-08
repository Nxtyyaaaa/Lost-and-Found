import { FormInput, SubmitBtn } from "../components";
import { toast } from "react-toastify";
import { customFetch } from "../utils";
import {
  Form,
  LoaderFunctionArgs,
  useLoaderData,
  redirect,
  ActionFunctionArgs,
} from "react-router-dom";

interface LoaderData {
  email: string;
  token: string;
}

export const loader = async ({ request }: LoaderFunctionArgs): Promise<LoaderData> => {
  const queryParams = new URL(request.url).searchParams;
  const email = queryParams.get("email") || "";
  const token = queryParams.get("token") || "";

  return { email, token };
};

export const action = async ({ request }: ActionFunctionArgs): Promise<null | Response> => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData) as Record<string, string>;

  if (data.password !== data.confirmPassword) {
    toast.error("Passwords do not match");
    return null;
  }

  const { token, email, password } = data;

  try {
    const response = await customFetch.post("/auth/reset-password", {
      password,
      token,
      email,
    });

    toast.success(response?.data?.msg);
    return redirect("/login");
  } catch (error: unknown) {
    const err = error as { response?: { data?: { msg?: string } } };
    const errorMessage = err?.response?.data?.msg || "An error occurred";
    toast.error(errorMessage);
    return null;
  }
};

const ResetPassword = (): JSX.Element => {
  const { email, token } = useLoaderData() as LoaderData;

  return (
    <div className="grid place-items-center h-screen">
      <Form
        className="card bg-base-300 w-96 shadow-xl hover:shadow-2xl duration-300"
        method="post"
      >
        <div className="card-body items-center">
          <h2 className="card-title mb-4">Reset Password</h2>

          <input type="hidden" name="token" value={token} />
          <input type="hidden" name="email" value={email} />

          <FormInput name="password" type="password" label="Password" />
          <FormInput name="confirmPassword" type="password" label="Confirm Password" />

          <SubmitBtn text="Reset Password" />
        </div>
      </Form>
    </div>
  );
};

export default ResetPassword;
