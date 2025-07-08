import { useLoaderData } from "react-router-dom";
import ProfileCard from "./ProfileCard";

interface Item {
  _id: string;
  title: string;
  thumbnail: string;
  description: string;
  type: string;
  location: string;
  category: string;
  date: string;
}

interface LoaderData {
  items: Item[];
}

const ProfileGrid = () => {
  const { items } = useLoaderData() as LoaderData;

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 place-items-center h-full">
      {items?.map((item) => (
        <ProfileCard key={item._id} item={item} />
      ))}
    </div>
  );
};

export default ProfileGrid;
