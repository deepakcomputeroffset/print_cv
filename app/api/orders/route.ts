import { NextResponse } from "next/server";
import { mockOrders } from "../mock/orders";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    // const session = await auth();

    // if (session?.user?.role !== "ADMIN") {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    return NextResponse.json(mockOrders);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching orders" },
      { status: 500 }
    );
  }
}
