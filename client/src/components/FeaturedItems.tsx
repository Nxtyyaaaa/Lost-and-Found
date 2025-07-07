import SectionTitle from './SectionTitle';
import ItemsGrid from './ItemsGrid';

const FeaturedItems = (): JSX.Element => {
  return (
    <div>
      <SectionTitle text="Some Listings" />
      <ItemsGrid />
    </div>
  );
};

export default FeaturedItems;
