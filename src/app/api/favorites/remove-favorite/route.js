import connectToDB from "@/database";
import Favorites from "@/models/Favorite";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({
        success: false,
        message: "Favorite item ID is required",
      });
    }

    const deletedFavoriteMedia = await Favorites.findByIdAndDelete(id);

    if (deletedFavoriteMedia) {
      return NextResponse.json({
        success: true,
        message: "Removed item from Favorite Successfully ",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Something wen wrong",
      });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      success: false,
      message: "Server Error",
    });
  }
}
