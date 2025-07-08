import { Link, useLoaderData, LoaderFunctionArgs } from "react-router-dom";
import { useState } from "react";
import { customFetch } from "../utils";
import { toast } from "react-toastify";
import { AiOutlineMessage } from "react-icons/ai";
import { MdOutlineReportProblem } from "react-icons/md";

// Types
interface ItemData {
  _id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  date: string;
  images: string[];
  thumbnail: string;
  type: string;
}

interface LoaderData {
  item: ItemData;
}

// Loader function
export const loader = async ({ params }: LoaderFunctionArgs): Promise<LoaderData | null> => {
  try {
    const response = await customFetch.get(`/items/${params.id}`);
    return { item: response.data.item };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { msg?: string } } };
    const errorMessage = err?.response?.data?.msg || "Item not found.";
    toast.error(errorMessage);
    return null;
  }
};

// Component
const SingleItem = (): JSX.Element => {
  const loaderData = useLoaderData() as LoaderData;
  const { item } = loaderData;
  const { title, category, description, location, date, images, thumbnail, type } = item;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const totalImages = images.length + 1;

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handlePrev = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalImages - 1 : prevIndex - 1));
  };

  const handleNext = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex === totalImages - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="align-element">
      <div className="breadcrumbs">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/items">Listings</Link></li>
        </ul>
      </div>

      <div className="grid place-items-center md:grid-cols-2 gap-8">
        {/* Image Carousel */}
        <div className="carousel w-full max-w-sm h-[25rem] mt-4 rounded-lg overflow-hidden relative">
          <div
            className="carousel-inner"
            style={{
              display: "flex",
              transition: "transform 0.5s ease-in-out",
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            <div className="carousel-item w-full flex-shrink-0">
              <img src={thumbnail} alt="Item Image" className="object-cover w-full" />
            </div>
            {images.map((image, index) => (
              <div className="carousel-item w-full flex-shrink-0" key={index}>
                <img src={image} alt={`Item image ${index + 1}`} className="object-cover w-full" />
              </div>
            ))}
          </div>

          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <button
              onClick={handlePrev}
              className={`btn btn-circle ${totalImages <= 1 ? "hidden" : ""}`}
            >
              ❮
            </button>
            <button
              onClick={handleNext}
              className={`btn btn-circle ${totalImages <= 1 ? "hidden" : ""}`}
            >
              ❯
            </button>
          </div>
        </div>

        {/* Info Panel */}
        <div className="w-full max-w-sm flex flex-col justify-between h-full md:tracking-wider leading-8 lg:leading-8">
          <div>
            <div className="flex justify-between items-center w-full m-2">
              <div className="badge badge-secondary uppercase font-semibold">{type}</div>
              <Link to="#">
                <AiOutlineMessage className="mr-2 btn btn-ghost btn-circle p-1" />
              </Link>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl text-center">{title}</h1>
              <h2 className="text-md md:text-xl mt-4 mb-2 font-medium">{description}</h2>
              <h2>
                <span className="font-medium">Location</span>: {location}
              </h2>
              <h2>
                <span className="font-medium">{type} on</span>: {formatDate(date)}
              </h2>
              <h2>
                <span className="font-medium">Category</span>: {category}
              </h2>
            </div>
          </div>
          <Link to="#" className="text-xl btn btn-error mt-4">
            <MdOutlineReportProblem /> Report
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SingleItem;
