import connectToDB from "@/database";
import Favorites from "@/models/Favorite";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connectToDB();

    const data = await req.json();

    const isFavoriteAlreadyExists = await Favorites.find({
      uid: data.uid,
      movieID: data.movieID,
      accountID: data.accountID,
    });

    if (isFavoriteAlreadyExists && isFavoriteAlreadyExists.length > 0) {
      return NextResponse.json({
        success: false,
        message: "This is already added to Favorites",
      });
    }

    const newlyAddedFavorite = await Favorites.create(data);
    if (newlyAddedFavorite) {
      return NextResponse.json({
        success: true,
        message: "Added to you favorite successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Something went wrong",
      });
    }
  } catch (e) {
    console.log("Error", e);
    return NextResponse.json({
      success: false,
      message: "Errors with the server",
    });
  }
}
