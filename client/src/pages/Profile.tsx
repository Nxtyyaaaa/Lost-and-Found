import { toast } from 'react-toastify';
import { customFetch } from '../utils';
import { Link, redirect, useLoaderData, Form, useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { Outlet } from 'react-router-dom';
import { useState, FormEvent } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store'; // Ensure this type exists

type UserType = {
  name: string;
  items: { status: string }[];
  profileImage: string;
  credits: number;
  branch: string;
};

type LoaderReturnType = {
  user: UserType;
  items: any[];
  categories: string[];
  locations: string[];
  branches: string[];
};

export const loader = async (): Promise<LoaderReturnType | Response> => {
  try {
    const response = await customFetch.get('/users/current');
    const { items } = response.data.user;
    const unResolvedItems = items.filter((item: any) => item.status !== 'Resolved');

    return {
      user: response.data.user,
      items: unResolvedItems,
      categories: response.data.categories,
      locations: response.data.locations,
      branches: response.data.branches,
    };
  } catch (error: any) {
    const errorMessage = error?.response?.data?.msg || 'An error occurred';
    toast.error(errorMessage);
    return redirect('/login');
  }
};

const Profile = () => {
  const { user, branches } = useLoaderData() as LoaderReturnType;
  const { name, items, profileImage, credits, branch } = user;

  const [imageURL, setImageURL] = useState<string | null>(null);
  const userId = useSelector((state: RootState) => state.userState.user.userId);
  const navigate = useNavigate();

  const handleImageUpload = async (e: FormEvent) => {
    e.preventDefault();
    const fileInput = document.querySelector<HTMLInputElement>('input[name="image"]');
    if (!fileInput?.files?.[0]) return;

    const formData = new FormData();
    formData.append('image', fileInput.files[0]);

    const toastId = toast.loading('Uploading Image...');

    try {
      const response = await customFetch.post('/items/upload-image', formData);
      setImageURL(response.data.image);
      toast.update(toastId, { render: 'Image uploaded successfully', type: 'success', isLoading: false, autoClose: 2000 });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.msg || 'An error occurred';
      toast.update(toastId, { render: errorMessage, type: 'error', isLoading: false, autoClose: 2000 });
    }
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (imageURL) formData.set('profileImage', imageURL);

    const data = Object.fromEntries(formData);
    const toastId = toast.loading('Updating Profile...');

    try {
      const response = await customFetch.patch(`/users/update/${userId}`, data);
      toast.update(toastId, { render: response.data.msg, type: 'success', isLoading: false, autoClose: 2000 });
      document.getElementById('modal_edit')?.close();
      return navigate('/profile');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.msg || 'An error occurred';
      toast.update(toastId, { render: errorMessage, type: 'error', isLoading: false, autoClose: 2000 });
    }
  };

  return (
    <div className="drawer lg:drawer-open h-full">
      <input type="checkbox" id="drawer" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-start justify-start">
        <div className="flex align-element mt-10 justify-between">
          <label htmlFor="drawer" className="btn btn-primary btn-sm md:btn-md drawer-button lg:hidden">
            <div>Profile Info</div>
          </label>
        </div>
        <Outlet />
      </div>
      <div className="drawer-side">
        <label htmlFor="drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="flex flex-col bg-base-200 text-base-content h-screen w-80 p-4 items-center justify-between">
          <div className="text-2xl font-medium">TrackBack</div>
          <div className="mt-[-5rem]">
            <img src={profileImage} className="rounded-full m-4 w-28" />
            <div className="text-center">
              <div className="text-xl">{name}</div>
              <div className="text-xs">{branch}</div>
            </div>
            <div className="mt-4 text-center">Credits Earned : {credits}</div>
          </div>

          <ul className="w-full ml-[8rem] mt-[-10rem]">
            <li className="hover:bg-base-300 pl-2 hover:pl-3 duration-300 rounded-md max-w-[10rem]">
              <button onClick={() => document.getElementById('modal_edit')?.showModal()}>
                <FaEdit className="inline-block" /> Edit Profile
              </button>
              <dialog id="modal_edit" className="modal">
                <div className="modal-box">
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => document.getElementById('modal_edit')?.close()}>
                    ✕
                  </button>

                  <h2 className="text-2xl text-center font-medium">Edit Profile</h2>

                  <Form method="patch" onSubmit={handleFormSubmit}>
                    <label className="form-control w-full max-w-xs">
                      <div className="label">
                        <span className="label-text mb-[-0.3rem] font-medium">Name</span>
                      </div>
                      <input type="text" name="name" className="input input-bordered w-full max-w-xs input-sm" defaultValue={name} />
                    </label>

                    <label className="form-control w-full max-w-xs">
                      <div className="label">
                        <span className="label-text mb-[-0.3rem] font-medium">Branch</span>
                      </div>
                      <select name="branch" className="select select-bordered w-full max-w-xs select-sm" defaultValue={branch}>
                        {branches.map((b) => (
                          <option key={b}>{b}</option>
                        ))}
                      </select>
                    </label>

                    <label className="form-control w-full max-w-xs">
                      <div className="label">
                        <span className="label-text mb-[-0.3rem] font-medium">Profile Image</span>
                      </div>
                      <div className="flex justify-center items-center gap-2">
                        <input type="file" name="image" className="file-input file-input-bordered w-full max-w-xs file-input-sm" />
                        <button className="btn btn-neutral btn-xs w-12" onClick={handleImageUpload}>
                          Add
                        </button>
                      </div>
                    </label>

                    <input name="profileImage" className="hidden" defaultValue={imageURL ?? ''} />

                    <div className="text-center">
                      <button type="submit" className="btn btn-neutral btn-sm mt-2 w-32">
                        Submit
                      </button>
                    </div>
                  </Form>
                </div>
              </dialog>
            </li>
            <li className="hover:bg-base-300 pl-2 hover:pl-3 duration-300 rounded-md mt-2 max-w-[10rem]">
              <Link to="/profile/items">
                <FaEdit className="inline-block" /> All Listings
              </Link>
            </li>
            <li className="hover:bg-base-300 pl-2 hover:pl-3 duration-300 rounded-md mt-2 max-w-[10rem]">
              <Link to="">
                <FaEdit className="inline-block" /> Resolved issues
              </Link>
            </li>
          </ul>

          <Link to="/" className="btn btn-primary font-medium">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
