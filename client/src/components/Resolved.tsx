import { customFetch } from "../utils";
import ItemsGrid from "./ItemsGrid";
import SectionTitle from "./SectionTitle";
import { LoaderFunction } from "react-router-dom";

interface Item {
  _id: string;
  title: string;
  status: string;
  [key: string]: any; // allow other dynamic props
}

interface LoaderData {
  items: Item[];
}

export const loader: LoaderFunction = async () => {
  const response = await customFetch.get("/users/current");
  const { items } = response.data.user;
  const resolvedItems = items.filter((item: Item) => item.status === "Resolved");
  return { items: resolvedItems };
};

const Resolved = () => {
  return (
    <div className="align-element mt-2">
      <SectionTitle text="Resolved Issues" />
      <ItemsGrid />
    </div>
  );
};

export default Resolved;
