import { FaGithub, FaLinkedin, FaRegCopyright } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

// Footer component displays the bottom section of the app
const Footer = () => {
  // Get the current year dynamically
  const date = new Date(Date.now()).getFullYear();

  return (
    <div className="bg-base-300 pt-4 w-full">
      {/* Top section: logo + social icons + navigation links */}
      <div className="align-element flex justify-center gap-16 md:gap-32 lg:gap-48">

        {/* Logo and social media icons */}
        <div>
          <span className="text-[1.75rem] bg-neutral p-2 rounded-lg text-neutral-content">
            TrackBack
          </span>

          <div className="flex justify-between">
            <Link to="https://github.com/Aryawart-kathpal/Lost-and-Found" target="_blank">
              <FaGithub className="mt-3 text-2xl" />
            </Link>
            <Link to="https://twitter.com/" target="_blank">
              <FaXTwitter className="mt-3 text-2xl" />
            </Link>
            <Link to="https://www.linkedin.com/in/aryawart-kathpal-617067288/" target="_blank">
              <FaLinkedin className="mt-3 text-2xl" />
            </Link>
          </div>
        </div>

        {/* Navigation links */}
        <ul className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8">
          <li>
            <Link to="/" className="hover:underline text-xl">Home</Link>
          </li>
          <li>
            <Link to="/about" className="hover:underline text-xl">About</Link>
          </li>
          <li>
            <Link to="/contact" className="hover:underline text-xl">Contact</Link>
          </li>
          <li>
            <Link to="/items" className="hover:underline text-xl">Listings</Link>
          </li>
        </ul>
      </div>

      {/* Bottom copyright section */}
      <div className="bg-base-300 tracking-widest text-center mt-2">
        Copyright <span>
          <FaRegCopyright className="inline" /> Lost and Found {date}.
        </span>
        <p className="font-medium">Designed and Developed by Aryawart Kathpal</p>
      </div>
    </div>
  );
};

export default Footer;