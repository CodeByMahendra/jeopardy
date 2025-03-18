import { supabase } from "@/lib/supabase";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
  }

  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage.from("blog-images").upload(fileName, file);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ url: data.publicUrl }), { status: 200 });
}
