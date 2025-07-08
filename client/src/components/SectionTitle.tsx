interface SectionTitleProps {
  text: string;
}

const SectionTitle = ({ text }: SectionTitleProps) => {
  return (
    <div className="border-b border-secondary pb-3 text-center">
      <h2 className="text-2xl md:text-3xl font-medium tracking-wider capitalize">{text}</h2>
    </div>
  );
};

export default SectionTitle;
