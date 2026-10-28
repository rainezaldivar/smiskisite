import Link from "next/link";
export default function NotFound() {
  return (
    <section className="container-page py-24 text-center">
      <p className="eyebrow">A little lost?</p>
      <h1 className="page-title mt-4">This corner is empty.</h1>
      <p className="muted mx-auto mt-5 max-w-md">
        We couldn’t find that page or product. There are plenty of little
        discoveries waiting elsewhere.
      </p>
      <Link href="/shop" className="button-primary mt-8">
        Explore the shop
      </Link>
    </section>
  );
}
