import { getCategories } from "@/app/actions/category";
import ExplorePage from "./page";

export default async function ExplorePageWrapper() {
  const result = await getCategories();
  const categories = result?.data || [];
  return <ExplorePage categories={categories} />;
}