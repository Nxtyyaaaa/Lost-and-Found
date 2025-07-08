import { useLoaderData, Form, useNavigate, useNavigation } from "react-router-dom";
import ProfileGrid from "./ProfileGrid";
import SectionTitle from "./SectionTitle";
import { FiMessageSquare, FiPlusSquare } from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import { customFetch } from "../utils";
import Loading from "./Loading";

interface LoaderData {
  locations: string[];
  categories: string[];
  branches: string[];
}

const ProfileItems = () => {
  const { locations, categories, branches } = useLoaderData() as LoaderData;

  const navigation = useNavigation();
  const navigate = useNavigate();

  const [imageURL, setImageURL] = useState<string | null>(null);

  const handleImageUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const fileInput = document.querySelector('input[name="image"]') as HTMLInputElement;
    if (!fileInput?.files?.[0]) return;

    const formData = new FormData();
    formData.append("image", fileInput.files[0]);

    const toastId = toast.loading("Uploading Image...");

    try {
      const response = await customFetch.post("/items/upload-image", formData);
      setImageURL(response.data.image);
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

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!imageURL) {
      toast.error("Please upload an image");
      return;
    }

    formData.set("thumbnail", imageURL);
    const data = Object.fromEntries(formData);

    const toastId = toast.loading("Creating Item...");

    try {
      const response = await customFetch.post("/items", data);
      toast.update(toastId, {
        render: response.data.msg,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      const modal = document.getElementById("create") as HTMLDialogElement;
      modal?.close();
      navigate("/profile/items");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.msg || "An error occurred";
      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
      const modal = document.getElementById("create") as HTMLDialogElement;
      modal?.close();
    }
  };

  const isLoading = navigation.state === "loading";
  if (isLoading) return <Loading />;

  return (
    <div className="align-element mt-2">
      <SectionTitle text="Your Listings" />
      <div className="flex w-full justify-between items-center">
        <Link to="#" className="btn btn-ghost btn-sm md:btn-xl">
          <FiMessageSquare className="inline-block mr-[-0.3rem]" />
          Inbox
        </Link>

        <button
          className="btn btn-ghost btn-sm md:btn-xl"
          onClick={() => {
            const modal = document.getElementById("create") as HTMLDialogElement;
            modal?.showModal();
          }}
        >
          <FiPlusSquare className="inline-block mr-[-0.3rem]" />
          Create Item
        </button>

        <dialog id="create" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h2 className="w-full text-center font-medium text-xl">Create Item</h2>

            <Form className="mt-4" method="post" onSubmit={handleFormSubmit}>
              <label className="form-control w-full max-w-xs">
                <div className="label mb-[-0.3rem]">
                  <span className="label-text font-medium">Title</span>
                </div>
                <input type="text" name="title" className="input input-bordered w-full max-w-xs input-sm" />
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label mb-[-0.3rem]">
                  <span className="label-text font-medium">Type</span>
                </div>
                <select name="type" className="select select-bordered select-sm" defaultValue="">
                  <option disabled value="">Select Type</option>
                  <option>Lost</option>
                  <option>Found</option>
                </select>
              </label>

              <label className="form-control">
                <div className="label">
                  <span className="label-text font-medium">Description</span>
                </div>
                <textarea name="description" className="textarea textarea-bordered h-24" />
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label mb-[-0.3rem]">
                  <span className="label-text font-medium">Category</span>
                </div>
                <select name="category" className="select select-bordered select-sm" defaultValue="">
                  <option disabled value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label mb-[-0.3rem]">
                  <span className="label-text font-medium">Location</span>
                </div>
                <select name="location" className="select select-bordered select-sm" defaultValue="">
                  <option disabled value="">Select Location</option>
                  {locations.map((location) => (
                    <option key={location}>{location}</option>
                  ))}
                </select>
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label mb-[-0.3rem]">
                  <span className="label-text font-medium">Date</span>
                </div>
                <input type="date" name="date" className="input input-bordered input-sm" />
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text mb-[-0.3rem] font-medium">Thumbnail Image</span>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <input type="file" name="image" className="file-input file-input-bordered w-full max-w-xs file-input-sm" />
                  <button className="btn btn-neutral btn-xs w-12" onClick={handleImageUpload}>
                    Add
                  </button>
                </div>
              </label>

              <div className="w-full text-center mt-2">
                <button type="submit" className="btn btn-neutral btn-sm w-32">
                  Submit
                </button>
              </div>
            </Form>
          </div>
        </dialog>
      </div>

      <ProfileGrid />
    </div>
  );
};

export default ProfileItems;
