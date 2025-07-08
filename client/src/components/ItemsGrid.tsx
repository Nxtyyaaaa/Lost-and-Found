import { useLoaderData } from "react-router-dom";
import ItemCard from "./ItemCard";

type Item = {
  _id: string;
  title: string;
  thumbnail: string;
  description: string;
  type: string;
  location: string;
  category: string;
  date: string;
};

type LoaderData = {
  items: Item[];
};

const ItemsGrid = (): JSX.Element => {
  const { items } = useLoaderData() as LoaderData;

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 mt-8 gap-4 place-items-center h-full">
      {items?.map((item) => (
        <ItemCard key={item._id} item={item} />
      ))}
    </div>
  );
};

export default ItemsGrid;
