

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addMonths, addYears } from "date-fns";

export async function PUT(req) {
    try {
        const { userId, membership } = await req.json();

        if (!userId || !membership) {
            return NextResponse.json({ message: "User ID and new membership are required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const membershipCosts = {
            ONE_MONTH: 50,
            ONE_YEAR: 150,
            LIFETIME: 400
        };

        if (user.membership === "LIFETIME") {
            return NextResponse.json({ message: "Lifetime members cannot downgrade membership" }, { status: 403 });
        }
        if (user.membership === "ONE_YEAR" && membership === "ONE_MONTH") {
            return NextResponse.json({ message: "Cannot downgrade to one-month while one-year is active" }, { status: 403 });
        }
        if (user.score < membershipCosts[membership]) {
            return NextResponse.json({ message: "Not enough points to purchase membership" }, { status: 400 });
        }

        let expiryDate = null;
        if (membership === "ONE_MONTH") {
            expiryDate = addMonths(new Date(), 1);
        } else if (membership === "ONE_YEAR") {
            expiryDate = addYears(new Date(), 1);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                membership: membership,
                score: user.score - membershipCosts[membership],
                membershipExpiry: expiryDate
            }
        });

        return NextResponse.json({ message: "Membership updated successfully", user: updatedUser }, { status: 200 });

    } catch (error) {
        console.error("Error updating membership:", error);
        return NextResponse.json({ message: "Error updating membership" }, { status: 500 });
    }
}
