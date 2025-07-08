import { Footer } from "../components";

const About = (): JSX.Element => {
  return (
    <>
      <div className="align-element">
        <h1 className="text-3xl text-center font-medium">About Us</h1>
        <div className="flex w-full justify-center">
          <p className="mt-4 text-xl max-w-[50rem]">
            Welcome to <span className="font-medium">TrackBack</span>, the lost and found platform for our college campus. Our goal is to help reunite lost items with their owners quickly and efficiently. Whether you've lost something or found an item, our easy-to-use system ensures a smooth process for everyone. Join us in keeping our campus connected and clutter-free!
            <br />
            <br />
            We understand the inconvenience of losing personal belongings, which is why we've created a platform that is both reliable and user-friendly. By using <span className="font-medium">TrackBack</span>, you can easily report lost items, browse found items, and connect with others to retrieve your belongings. Let's work together to make our campus a more organized and considerate place.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
