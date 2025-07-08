import { Link } from "react-router-dom";

// Define the expected structure of an item object
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

// Component props typing
type ItemCardProps = {
  item: Item;
};

const ItemCard = ({ item }: ItemCardProps): JSX.Element => {
  const { title, thumbnail, description, type, location, category, date } = item;

  // Helper to convert ISO date to readable format
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const link = `/items/${item._id}`;

  return (
    <Link to={link}>
      <div className="card card-compact bg-base-300 duration-300 w-72 h-[27rem] hover:shadow-xl flex flex-col">
        <figure>
          <img src={thumbnail} className="object-cover h-48 w-full" alt={title} />
        </figure>
        <div className="card-body">
          <div className="w-full flex justify-between items-center">
            <h2 className="card-title w-full">{title}</h2>
            <div className="badge badge-secondary uppercase font-medium">{type}</div>
          </div>
          <p className="text-sm text-base mb-3">{description}</p>
          <p className="text-sm text-base">
            <span className="font-semibold">Found at</span> : {location}
          </p>
          <p className="text-sm text-base">
            <span className="font-semibold">Date Found</span> : {formatDate(date)}
          </p>
          <Link to="/">
            <button className="btn btn-outline btn-secondary btn-block mt-4 rounded-2xl">
              <span>Message</span>
            </button>
          </Link>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;
