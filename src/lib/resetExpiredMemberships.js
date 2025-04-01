import { prisma } from "@/lib/prisma";

async function resetExpiredMemberships() {
    const now = new Date();

    await prisma.user.updateMany({
        where: {
            membershipExpiry: { lte: now },
            membership: { not: "NONE" }
        },
        data: { membership: "NONE", membershipExpiry: null }
    });

    console.log("Expired memberships reset successfully.");
}

resetExpiredMemberships();
