import { Link, Form, useLoaderData, redirect } from "react-router-dom";
import { customFetch } from "../utils";
import { toast } from "react-toastify";
import { useState } from "react";

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
  categories: string[];
  locations: string[];
}

interface ProfileCardProps {
  item: Item;
}

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const toastId = toast.loading("Updating Item...");

  try {
    const response = await customFetch.patch(`items/${data.item}`, data);
    toast.update(toastId, {
      render: response.data.msg,
      type: "success",
      isLoading: false,
      autoClose: 2000,
    });
    const modal = document.getElementById(`modal-${data.item}`) as HTMLDialogElement;
    modal?.close();
    return redirect("/profile/items");
  } catch (error: any) {
    const errorMessage = error?.response?.data?.msg || "An error occurred";
    toast.update(toastId, {
      render: errorMessage,
      type: "error",
      isLoading: false,
      autoClose: 2000,
    });
    return null;
  }
};

const ProfileCard = ({ item }: ProfileCardProps) => {
  const { title, thumbnail, description, type, location, category, date } = item;
  const { categories, locations } = useLoaderData() as LoaderData;

  const [activeImage, setActiveImage] = useState<string | null>(null);

  const link = `/items/${item._id}`;

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatDateForInput = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const openModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const modal = document.getElementById(`modal-${item._id}`) as HTMLDialogElement;
    modal?.showModal();
  };

  const closeModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const modal = document.getElementById(`modal-${item._id}`) as HTMLDialogElement;
    modal?.close();
  };

  const handleImageUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const fileInput = document.querySelector(
      'input[name="itemImage"]'
    ) as HTMLInputElement;

    if (!fileInput?.files?.[0]) return;

    const formData = new FormData();
    formData.append("image", fileInput.files[0]);

    const toastId = toast.loading("Uploading Image...");

    try {
      const response = await customFetch.post("/items/upload-image", formData);
      setActiveImage(response.data.image);
      toast.update(toastId, {
        render: "Image uploaded successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.msg || "An error occurred";
      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="cursor-pointer">
      <div className="card card-compact bg-base-300 duration-300 w-72 h-[27rem] hover:shadow-xl flex flex-col">
        <figure onClick={() => (window.location.href = link)}>
          <img src={thumbnail} className="object-cover h-48 w-full" alt={title} />
        </figure>
        <div className="card-body" onClick={() => (window.location.href = link)}>
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
        </div>
        <button
          onClick={openModal}
          className="btn btn-outline btn-secondary btn-block mt-4 rounded-2xl text-[1rem]"
        >
          Edit
        </button>
        <dialog id={`modal-${item._id}`} className="modal">
          <div className="modal-box">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg text-center">Edit Item</h3>
            <Form className="mt-4" method="patch">
              <label className="form-control w-full max-w-xs">
                <div className="label mb-[-0.3rem]">
                  <span className="label-text font-medium">Title</span>
                </div>
                <input
                  type="text"
                  name="title"
                  defaultValue={title}
                  className="input input-bordered w-full max-w-xs input-sm"
                />
              </label>

              <label className="form-control">
                <div className="label">
                  <span className="label-text font-medium">Description</span>
                </div>
                <textarea
                  name="description"
                  className="textarea textarea-bordered h-24"
                  defaultValue={description}
                ></textarea>
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label mb-[-0.3rem]">
                  <span className="label-text font-medium">Category</span>
                </div>
                <select
                  name="category"
                  className="select select-bordered select-sm"
                  defaultValue={category}
                >
                  {categories.map((cat) => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label mb-[-0.3rem]">
                  <span className="label-text font-medium">Location</span>
                </div>
                <select
                  name="location"
                  className="select select-bordered select-sm"
                  defaultValue={location}
                >
                  {locations.map((loc) => (
                    <option key={loc}>{loc}</option>
                  ))}
                </select>
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label mb-[-0.3rem]">
                  <span className="label-text font-medium">Date</span>
                </div>
                <input
                  type="date"
                  name="date"
                  className="input input-bordered input-sm"
                  defaultValue={formatDateForInput(date)}
                />
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text mb-[-0.3rem] font-medium">Item Image</span>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <input
                    type="file"
                    name="itemImage"
                    className="file-input file-input-bordered w-full max-w-xs file-input-sm"
                  />
                  <button
                    className="btn btn-neutral btn-xs w-12"
                    onClick={handleImageUpload}
                  >
                    Add
                  </button>
                </div>
              </label>

              {activeImage && (
                <input type="text" name="image" defaultValue={activeImage} className="hidden" />
              )}

              <input type="hidden" name="item" defaultValue={item._id} />

              <div className="w-full text-center mt-2">
                <button type="submit" className="btn btn-neutral btn-sm w-32">
                  Submit
                </button>
              </div>
            </Form>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default ProfileCard;
