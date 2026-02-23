import { getCategories } from "@/app/actions/category";
import ExploreClient from "./ExploreClient";

export default async function ExplorePage() {
  const result = await getCategories();
  const categories = result.success && Array.isArray(result.data) ? result.data : [];
  return <ExploreClient categories={categories} />;
}