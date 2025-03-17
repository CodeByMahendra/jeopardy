import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";



export async function GET() {
  try {
    const allBlogs = await prisma.blog.findMany();
    console.log("allBlogs:", allBlogs);

    return NextResponse.json(allBlogs);
  } catch (error) {
    console.error("Error getting allBlogs:", error);
    return NextResponse.json({ message: "Error getting allBlogs", error }, { status: 500 });
  }
}



export async function POST(req) {

  try {

      const body = await req.json()
 console.log("Data=",body)
 const { category , image, title, article } = body;

      if(!category  || !image || !title || !article){
          return NextResponse.json({ message: "Missing fields" }, { status: 400 });

      }

      const createBlog = await prisma.blog.create({ data: {category , title,  image, article } });

      console.log("createBlog:", createBlog);
  return NextResponse.json(createBlog);

  } catch (error) {
      console.error("Error updating question:", error);
      return NextResponse.json({ message: "Error updating question", error }, { status: 500 });
  }
  
}


export async function PUT(req) {
  try {
    const body = await req.json();
    console.log("Received Data=", body);

    const { id,categoryId, title,  image, content } = body;

    if (!id || !categoryId || !title || !image || !content  === undefined) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const updatedBlogs = await prisma.blog.update({
      where: { id },
      data: {categoryId, title, image, content },
    });

    console.log("Updated Blogs:", updatedBlogs);
    return NextResponse.json(updatedBlogs);
  } catch (error) {
    console.error("Error updating Blogs:", error);
    return NextResponse.json({ message: "Error updating Blogs", error }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    const body = await req.json();
    console.log("Received Data for Deletion =", body);

    const { id } = body;

    if (!id) {
      return NextResponse.json({ message: "Blog ID is required" }, { status: 400 });
    }

    const deletedBlog = await prisma.blog.delete({
      where: { id },
    });

    console.log("Deleted Blog:", deletedBlog);
    return NextResponse.json({ message: "Blog deleted successfully", deletedBlog });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json({ message: "Error deleting blog", error }, { status: 500 });
  }
}

