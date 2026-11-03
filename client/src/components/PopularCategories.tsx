import CategoryCarousel, { type CarouselCategory } from "./CategoryCarousel";

const IMG = "https://html.aqlova.com/listbnb-prv/listbnb/assets/img/category";

/**
 * Photos come from the original template. For production, download them into
 * /public/categories and change the paths to "/categories/<file>.png".
 */
const categories: CarouselCategory[] = [
  { id: "home", label: "Home Appliance", image: `${IMG}/category-1-1.png`, from: "#fbc7a8", to: "#6b3320" },
  { id: "sport", label: "Sport & Equipments", image: `${IMG}/category-1-2.png`, from: "#f6b08a", to: "#5a2f1c" },
  { id: "mobile", label: "Mobile & Accessories", image: `${IMG}/category-1-3.png`, from: "#f9c2a0", to: "#7a3a1f" },
  { id: "pets", label: "Pets & Animal", image: `${IMG}/category-1-4.png`, from: "#f3a07a", to: "#4a2616" },
];

export default function PopularCategories() {
  return (
    <section className="lb-section lb-popcat">
      <div className="lb-popcat-bg" aria-hidden="true">Category</div>
      <div className="container">
        <CategoryCarousel
          items={categories}
          label="Category"
          title="Popular categories"
          description="TinyAdds a largest classified listing website & marketplace offers"
        />
      </div>
    </section>
  );
}
