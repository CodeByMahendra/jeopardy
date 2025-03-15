import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

const SECRET_KEY = "moijhfdftyujbvy";

export default function UserDashboard() {
    const token = cookies().get("token")?.value;

    if (!token) {
        redirect("/sign-in");
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        if (decoded.role !== "user") {
            redirect("/admin/create-blog");
        }
    } catch (error) {
        redirect("/sign-in");
    }

    return <h1>User Dashboard</h1>;
}
