import Layout from "@/components/Layout";
import B2BHero from "@/components/b2b/B2BHero";
import B2BSegments from "@/components/b2b/B2BSegments";
import B2BProcess from "@/components/b2b/B2BProcess";
import B2BForm from "@/components/b2b/B2BForm";

export default function B2B() {
  return (
    <Layout>
      <B2BHero />
      <B2BSegments />
      <B2BProcess />
      <B2BForm />
    </Layout>
  );
}
