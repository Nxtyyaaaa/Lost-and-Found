interface Testimonial {
  photo: string;
  testimonial: string;
  name: string;
  role: string;
  date?: string;
}

interface TestimonialCardProps {
  item: Testimonial;
}

const TestimonialCard = ({ item }: TestimonialCardProps) => {
  const { photo, testimonial, name, role } = item;

  return (
    <div className="card bg-base-100 w-96 shadow-xl hover:shadow-2xl duration-300 h-56 flex flex-col">
      <div className="card-body">
        <h2 className="card-title">
          <img src={photo} alt="User Image" className="h-10 w-10 rounded-full" />
          <span className="text-sm inline-block ml-2 font-semibold tracking-wider text-[1.2rem]">{name}</span>
        </h2>
        <p className="font-semibold pl-14 mt-[-0.85rem] text-xs">{role}</p>
        <div className="pl-14 mt-[-0.25rem]">
          <p>{testimonial}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
