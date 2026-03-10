import Layout from "@/components/Layout";
import serviceHardwood from "@/assets/service-hardwood.jpg";
import serviceSanding from "@/assets/service-sanding.jpg";
import serviceVinyl from "@/assets/service-vinyl.jpg";
import serviceStaircase from "@/assets/service-staircase.jpg";
import heroImg from "@/assets/hero-flooring.jpg";
import craftsman from "@/assets/craftsman.jpg";
import { useState } from "react";

const categories = ["All", "Hardwood", "Refinishing", "Vinyl", "Staircase"];

const projects = [
  { img: serviceHardwood, title: "Hardwood Floor Installation", category: "Hardwood" },
  { img: serviceSanding, title: "Floor Sanding & Refinishing", category: "Refinishing" },
  { img: serviceVinyl, title: "Luxury Vinyl Plank", category: "Vinyl" },
  { img: serviceStaircase, title: "Custom Staircase", category: "Staircase" },
  { img: heroImg, title: "Living Room Hardwood", category: "Hardwood" },
  { img: craftsman, title: "Refinishing in Progress", category: "Refinishing" },
];

export default function Gallery() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? projects : projects.filter(p => p.category === filter);

  return (
    <Layout>
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Our <span className="gold-gradient-text">Gallery</span>
          </h1>
          <p className="text-muted-foreground">See our craftsmanship in action</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === c ? "bg-gold text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <div key={i} className="group elevated-card overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="font-display font-bold text-foreground">{p.title}</h3>
                  <span className="text-xs text-gold">{p.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
