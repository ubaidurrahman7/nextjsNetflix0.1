import connectToDB from "@/database";
import Account from "@/models/account";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connectToDB();

    const { name, pin, uid } = await req.json();

    const isAccountAlreadyExists = await Account.find({ uid, name });
    const allAccount = await Account.find({});

    if (isAccountAlreadyExists && isAccountAlreadyExists.length > 0) {
      return NextResponse.json({
        success: false,
        message: "Please try with a different name",
      });
    }

    if (allAccount && allAccount.length === 4) {
      return NextResponse.json({
        success: false,
        message: "You can only add max 4 accounts",
      });
    }

    const hashPin = await hash(pin, 12);

    const newlyCreatedAccount = await Account.create({
      name,
      pin: hashPin,
      uid,
    });
    if (newlyCreatedAccount) {
      return NextResponse.json({
        success: true,
        message: "Account created successfully",
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
