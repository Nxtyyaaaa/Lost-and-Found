import { toast } from "react-toastify";
import { customFetch } from "../utils";
import { FeaturedItems, UserTestimonials } from "../components";
import { LoaderFunctionArgs } from "react-router-dom";

interface LoaderResponse {
  items: any[];
}

export const loader = async ({ request }: LoaderFunctionArgs): Promise<LoaderResponse | null> => {
  const featured = true;

  try {
    const response = await customFetch.get(`/items?featured=${featured}`);
    return { items: response.data.items };
  } catch (error: any) {
    const errorMessage = error?.response?.data?.msg || "An error occurred";
    toast.error(errorMessage);
    return null;
  }
};

const Landing = (): JSX.Element => {
  return (
    <div className="align-element">
      <FeaturedItems />
      <UserTestimonials />
    </div>
  );
};

export default Landing;
