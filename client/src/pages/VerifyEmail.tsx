import { toast } from "react-toastify";
import { customFetch } from "../utils";
import { redirect, LoaderFunctionArgs } from "react-router-dom";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const queryParams = new URL(request.url).searchParams;
  const token = queryParams.get("token");
  const email = queryParams.get("email");

  if (!token || !email) {
    toast.error("Missing email verification token.");
    return redirect("/");
  }

  try {
    const response = await customFetch.get(`/auth/verify-email?token=${token}&email=${email}`);
    toast.success(response?.data?.msg);
    return redirect("/login");
  } catch (error: unknown) {
    const err = error as { response?: { data?: { msg?: string } } };
    const errorMessage = err?.response?.data?.msg || "An error occurred";
    toast.error(errorMessage);
    return redirect("/");
  }
};

const VerifyEmail = (): JSX.Element => {
  return (
    <div className="h-screen flex justify-center items-center">
      <h1 className="text-2xl font-medium">Verifying your email...</h1>
    </div>
  );
};

export default VerifyEmail;
