import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// POST /api/address  - create-user-own address
export async function POST(req) {
  try {
    const body = await req.json(); 
    const { street, city, state, country, zip ,userId } = body;

    if (!street || !city || !state || !country || !zip || !userId) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const existing = await prisma.address.findFirst({ where: { userId } });
if (existing) return NextResponse.json({ error: 'Address already exists' }, { status: 400 });


    const newAddress = await prisma.address.create({
      data: {userId, street, city, state, country, zip }, 
    });

    return NextResponse.json(newAddress, { status: 201 });
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 });
  }
}

// GET /api/address  - get-user-own address
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
    
        if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }
    const userAddress = await prisma.address.findMany({
      where: {
        userId:userId, 
      },
    });

    return NextResponse.json(userAddress);
  } catch (error) {
    console.error('Error getting address:', error);
    return NextResponse.json({ error: 'Failed to get address' }, { status: 500 });
  }
}

// DELETE /api/address  - delete-user-own address
export async function DELETE(req) {
  try {
    const body = await req.json(); 
    const { addressId } = body;

    const deletedAddress = await prisma.address.delete({
      where: {
        id: addressId, 
      },
    });

    return NextResponse.json(deletedAddress, { status: 200 });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}

// PUT /api/address  - update-user-own address
export async function PUT(req, context) {
  try {
    const body = await req.json(); 
    const {  street, city, state, country, zip ,addressId } = body;

    if (! addressId ||  !street || !city || !state || !country || !zip) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const updatedAddress = await prisma.address.update({
      where: {
        id :addressId,
      },
      data: { street, city, state, country, zip }, 
    });

    return NextResponse.json(updatedAddress, { status: 200 });
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

