import { toast } from "react-toastify";
import { ItemsGrid, Filters, Loading, PaginationContainer } from "../components";
import { customFetch } from "../utils";
import {
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
  LoaderFunctionArgs,
} from "react-router-dom";

interface LoaderResponse {
  items: any[];
  pagination: any;
  categories: string[];
  locations: string[];
  queryParams: Record<string, string>;
}

export const loader = async ({ request }: LoaderFunctionArgs): Promise<LoaderResponse | null> => {
  const queryParams = Object.fromEntries([...new URL(request.url).searchParams.entries()]);

  try {
    const response = await customFetch("/items", { params: queryParams });
    return {
      items: response.data.items,
      pagination: response.data.pagination,
      categories: response.data.categories,
      locations: response.data.locations,
      queryParams,
    };
  } catch (error: any) {
    const errorMessage = error?.response?.data?.msg || "An error occurred";
    toast.error(errorMessage);
    return null;
  }
};

const Items = (): JSX.Element => {
  const navigate = useNavigate();
  const { search, pathname } = useLocation();
  const { queryParams } = useLoaderData() as LoaderResponse;
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  const handleLostAndFound = (val: string) => {
    const searchParams = new URLSearchParams(search);
    searchParams.set("type", val);
    navigate(`${pathname}?${searchParams.toString()}`);
  };

  return (
    <div className="align-element">
      <Filters />
      <div className="w-full flex justify-end">
        <button
          onClick={() => handleLostAndFound("Lost")}
          className={`btn btn-ghost rounded-3xl ${queryParams.type === "Lost" ? "btn-active" : ""}`}
        >
          LOST
        </button>
        <button
          onClick={() => handleLostAndFound("Found")}
          className={`btn btn-ghost rounded-3xl ${queryParams.type === "Found" ? "btn-active" : ""}`}
        >
          FOUND
        </button>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <ItemsGrid />
          <PaginationContainer />
        </>
      )}
    </div>
  );
};

export default Items;
