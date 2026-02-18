import { getReviewsFromUser } from "@/app/actions/review";

export async function GET(request: Request, context: { params: { idUser: string } }) {
  const params = await context.params;
  const idUser = Number(params.idUser);
  if (isNaN(idUser)) {
    return new Response(JSON.stringify({ success: false, message: "Invalid idUser" }), { status: 400 });
  }
  return getReviewsFromUser({ idUser });
}