  import Link from "next/link";

export default function AdminSidebar() {
    return (
        <div className="w-64 h-screen right-0 bg-gray-900 text-white p-4">
            <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
            <ul>
                <li className="mb-2"><Link href="/admin/manage-blogs">Manage-Blogs</Link></li>
                <li className="mb-2"><Link href="/admin/create-category">Create-BlogCategory</Link></li>
                <li className="mb-2"><Link href="/admin/create-blog">Create-Blog</Link></li>
                <li className="mb-2"><Link href="/admin/manage-store">Manage-Store</Link></li>

                <li className="mb-2"><Link href="/admin/create-storeCategory">Create-StoreCategory</Link></li>

                <li className="mb-2"><Link href="/admin/create-store">Create-Store</Link></li>

                <li className="mb-2"><Link href="/admin/manage-order">Manage-Order</Link></li>

                <li className="mb-2"><Link href="/admin/manage-questions">Manage-Question</Link></li>


                <li className="mb-2"><Link href="/admin/manage-user">Manage-User</Link></li>

            </ul>
        </div>
    );
}
