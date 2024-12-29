import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";
import z from "zod";
import db from "../../../../prisma/db";
const Validator = z.object({
  firstTour: z.boolean().nullable(),
  secondTour: z.boolean().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstTour, secondTour } = Validator.parse(body);
    console.log(firstTour, secondTour);
    const dataToUpdate: Record<string, boolean | null> = {};
    if (firstTour !== undefined && firstTour !== null) {
      dataToUpdate.firstTour = firstTour;
    }
    if (secondTour !== undefined && secondTour !== null) {
      dataToUpdate.secondTour = secondTour;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return new Response("Internal Server Error", { status: 500 });
    }
    const { getUser } = await getKindeServerSession();

    const kindeUser = await getUser();
    if (!kindeUser) {
      return new Response("UnAuthorised", { status: 400 });
    }
    const { id: userId } = kindeUser;
    const user = await db.user.update({
      where: {
        id: userId,
      },
      data: dataToUpdate,
    });

    if (!user) {
      return new Response("Not Found", { status: 404 });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
