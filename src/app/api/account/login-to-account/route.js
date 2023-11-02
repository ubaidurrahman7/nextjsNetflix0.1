import connectToDB from "@/database";
import Account from "@/models/account";
import { NextResponse } from "next/server";
import { compare } from "bcryptjs"; // Import the compare function

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connectToDB();

    const { pin, accountId, uid } = await req.json();

    // console.log("Request Body:", pin, accountId, uid);

    const getCurrentAccount = await Account.findOne({ _id: accountId, uid });

    if (!getCurrentAccount) {
      // console.log("Account not found");
      return NextResponse.json({
        success: false,
        message: "Account not found",
      });
    }

    // Checking PIN using the imported compare function
    const checkPin = await compare(pin, getCurrentAccount.pin);
    // console.log("Check PIN Result:", checkPin);

    if (checkPin) {
      return NextResponse.json({
        success: true,
        message: "Welcome to Netflix",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Incorrect PIN! Please try again",
      });
    }
  } catch (e) {
    // console.error("Error:", e);
    return NextResponse.json({
      success: false,
      message: "Server Error: " + e.message,
    });
  }
}
