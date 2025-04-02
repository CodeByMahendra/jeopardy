

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// //Delete user from database

// export async function DELETE(req) {
//   try {
//     const { id } = await req.json(); 

//     console.log("UserId=",id)
//     if (!id) {
//       return NextResponse.json({ error: "User ID is required" }, { status: 400 });
//     }

//     const userId = String(id); 
//     console.log(userId)

//     await prisma.attempt.deleteMany({
//       where: { userId },
//     });

//     await prisma.cart.deleteMany({
//       where: { userId },
//     })

//     await prisma.cartItem.deleteMany({
//       where: { userId },
//     });

//     await prisma.wishlist.deleteMany({
//       where: { userId },
//     });

//     await prisma.orderItem.deleteMany({
//       where: { userId },
//     });
// await prisma.order.deleteMany({
//   where: { userId },
// })
//     await prisma.account.deleteMany({
//       where: { userId },
//     });

//     const deletedUser = await prisma.user.delete({
//       where: { id: userId },
//     });

//     console.log("Deleted user=",deletedUser)

//     return NextResponse.json({ message: "User deleted successfully!" });
//   } catch (error) {
//     console.error("Delete error:", error);
//     return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Delete user from database
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    console.log("UserId=", id);
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const userId = String(id);

    // Get all orders linked to this user
    const orders = await prisma.order.findMany({
      where: { userId },
      select: { id: true }, // Only select order IDs
    });

    const orderIds = orders.map((order) => order.id);

    if (orderIds.length > 0) {
      // 🔥 Delete all related OrderItems using orderIds instead of userId
      await prisma.orderItem.deleteMany({
        where: { orderId: { in: orderIds } },
      });

      // ✅ Now delete Orders
      await prisma.order.deleteMany({
        where: { id: { in: orderIds } },
      });
    }

    // Delete other related records
    await prisma.wishlist.deleteMany({ where: { userId } });
    await prisma.attempt.deleteMany({ where: { userId } });
    await prisma.account.deleteMany({ where: { userId } });

    // Find and delete cart and cart items
    const cart = await prisma.cart.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      await prisma.cart.delete({ where: { id: cart.id } });
    }

    // Finally, delete the user
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    console.log("Deleted user=", deletedUser);
    return NextResponse.json({ message: "User deleted successfully!" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
