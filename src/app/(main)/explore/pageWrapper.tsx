import { getCategories } from "@/app/actions/category";
import ExploreClient from "./ExploreClient";

export default async function ExplorePageWrapper() {
  const result = await getCategories();
  const categories = Array.isArray(result?.data) ? result.data : [];
  return <ExploreClient categories={categories} />;
}