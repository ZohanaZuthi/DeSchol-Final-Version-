import { Link } from "react-router-dom";

import img1 from "../assets/round/3.jpg";
import img2 from "../assets/round/8.jpg";
import img3 from "../assets/round/s.jpg";
import img4 from "../assets/round/p.jpg";
import img5 from "../assets/round/u.jpg";

const IMAGES = [img1, img2, img3, img4, img5];


function CircleImg({ src, className }) {
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      className={`rounded-full object-cover ring-2 ring-white/60 dark:ring-neutral-900 shadow-lg ${className}`}
    />
  );
}

export default function Home() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Find the right <span className="text-indigo-600">scholarship</span> for you.
          </h1>
          <p className="mt-4 text-neutral-600 dark:text-neutral-300">
            Filter by type, level, and location. Read news and updates. Apply in minutes.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              to="/scholarships"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500"
            >
              Browse Scholarships
            </Link>
            <Link
              to="/news"
              className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Latest News
            </Link>
          </div>
        </div>

        
        <div className="relative mx-auto md:mx-0 w-[18rem] h-[18rem] md:w-[22rem] md:h-[22rem]">
          <div className="absolute inset-0 -z-10 rounded-full bg-indigo-100/60 dark:bg-indigo-900/20 blur-2xl" />
          <CircleImg src={IMAGES[0]} className="absolute w-28 h-28 top-0 left-6" />
          <CircleImg src={IMAGES[1]} className="absolute w-36 h-36 top-8 right-0" />
          <CircleImg src={IMAGES[2]} className="absolute w-24 h-24 bottom-10 left-0" />
          <CircleImg src={IMAGES[3]} className="absolute w-32 h-32 bottom-0 right-8" />
          <CircleImg src={IMAGES[4]} className="absolute w-20 h-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    </section>
  );
}