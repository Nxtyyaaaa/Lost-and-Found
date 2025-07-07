import { FaSearch } from 'react-icons/fa';
import { Form, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

// Define the shape of data returned by the route loader
type LoaderData = {
  categories: string[];
  locations: string[];
  queryParams: {
    search?: string;
    order?: string;
    category?: string;
    location?: string;
  };
};

const Filters = (): JSX.Element => {
  // Get filter data and current query parameters from the loader
  const { categories, locations, queryParams } = useLoaderData() as LoaderData;
  const { search, order, category, location } = queryParams;

  // Store the selected sort option (latest/oldest)
  const [checkValue, setCheckValue] = useState<string>(order ?? 'latest');

  const navigation = useNavigate();
  const { search: searchVal, pathname } = useLocation();

  // When sort option changes, update local state and navigate to the new URL
  const handleOptionChange = (val: string): void => {
    const value = val === 'latest' ? 'latest' : 'oldest';
    setCheckValue(value);
    const searchParams = new URLSearchParams(searchVal);
    searchParams.set('order', value);
    navigation(`${pathname}?${searchParams.toString()}`);
  };

  return (
    <Form className="align-element bg-base-200 mb-4 p-4 rounded-md">
      {/* Search Input */}
      <label className="input input-bordered flex items-center gap-2 ">
        <input
          type="text"
          name="search"
          className="grow"
          placeholder="Search"
          defaultValue={search ?? ''}
        />
        <FaSearch />
      </label>

      {/* Filters: Category, Location, Order */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-2 w-full lg:place-items-center">

        {/* Category Dropdown */}
        <label className="form-control">
          <div className="label">
            <span className="font-medium">Category</span>
          </div>
          <select
            name="category"
            defaultValue={category ?? 'all'}
            className="select select-sm select-secondary capitalize max-w-[12rem] md:max-w-[14rem] lg:max-w-[16rem]"
          >
            {categories.map((category) => (
              <option value={category} key={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        {/* Location Dropdown */}
        <label className="form-control">
          <div className="label">
            <span className="font-medium">Location</span>
          </div>
          <select
            name="location"
            defaultValue={location ?? 'all'}
            className="select select-sm select-secondary capitalize max-w-[12rem] md:max-w-[14rem] lg:max-w-[16rem]"
          >
            {locations.map((location) => (
              <option value={location} key={location}>
                {location}
              </option>
            ))}
          </select>
        </label>

        {/* Order by (Latest/Oldest) */}
        <div>
          <div className="grid items-center mt-2 grid-cols-2 lg:grid-cols-1 max-w-[10rem]">
            <label className="font-medium">Order By</label>
            <div className="flex">
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-2">
                  <div className="label-text">Latest</div>
                  <input
                    type="radio"
                    name="order"
                    className="radio radio-sm checked:bg-red-500"
                    checked={checkValue === 'latest'}
                    onChange={() => handleOptionChange('latest')}
                  />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-2">
                  <span className="label-text">Oldest</span>
                  <input
                    type="radio"
                    name="order"
                    className="radio radio-sm checked:bg-red-500"
                    checked={checkValue === 'oldest'}
                    onChange={() => handleOptionChange('oldest')}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-sm btn-secondary w-[10rem] mt-2">
          Search
        </button>
      </div>
    </Form>
  );
};

export default Filters;

