import { ROLE } from "@prisma/client";
import {
    Blocks,
    Cuboid,
    Frame,
    Home,
    LayoutDashboard,
    Package,
    PictureInPicture,
    PiggyBank,
    ShoppingBag,
    ShoppingCart,
    UploadCloud,
    Users,
} from "lucide-react";
import { Session } from "next-auth";

export type RouteType = {
    title: string;
    icon: React.ElementType;
    url: string;
    pattern: RegExp;
    roles: ROLE[];
};

export const routes: RouteType[] = [
    {
        title: "Home",
        icon: Home,
        url: "/",
        pattern: /^\/$/,
        roles: ["ADMIN", "STAFF"],
    },
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: "/admin",
        pattern: /^\/admin$/,
        roles: ["ADMIN", "STAFF"],
    },
    {
        title: "Staffs",
        icon: Users,
        url: "/admin/staff?search=&sortorder=asc&perpage=100",
        pattern: /^\/admin\/staff(?:\/.*)?$/, // Matches /admin/staff and any nested route
        roles: ["ADMIN"],
    },
    {
        title: "C.Category",
        icon: Users,
        url: "/admin/customer-category",
        pattern: /^\/admin\/customer-category(?:\/.*)?$/,
        roles: ["ADMIN"],
    },
    {
        title: "Customers",
        icon: Users,
        url: "/admin/customer?search=&sortorder=asc&perpage=100",
        pattern: /^\/admin\/customer(?:\/.*)?$/,
        roles: ["ADMIN"],
    },
    {
        title: "Tasks",
        icon: Cuboid,
        url: "/admin/tasks?search=&sortorder=asc&perpage=100",
        pattern: /^\/admin\/tasks(?:\/.*)?$/,
        roles: [
            "ADMIN",
            "STAFF",
            "ACCOUNTANT",
            "JOB_MANAGER",
            "ORDER_MANAGER",
            "PRODUCT_MANAGER",
        ],
    },
    {
        title: "Wallet",
        icon: PiggyBank,
        url: "/admin/wallet?search=&sortorder=asc&perpage=100",
        pattern: /^\/admin\/wallet(?:\/.*)?$/,
        roles: ["ADMIN", "ACCOUNTANT"],
    },
    {
        title: "Category",
        icon: ShoppingBag,
        url: "/admin/category?search=&sortorder=asc&perpage=100",
        pattern: /^\/admin\/category(?:\/.*)?$/,
        roles: ["ADMIN", "PRODUCT_MANAGER"],
    },
    {
        title: "Products",
        icon: Package,
        url: "/admin/products?search=&sortorder=asc&perpage=100",
        pattern: /^\/admin\/products(?:\/.*)?$/,
        roles: ["ADMIN", "PRODUCT_MANAGER"],
    },
    {
        title: "Department",
        icon: Blocks,
        url: "/admin/department?search=&sortorder=asc&page=1&perpage=100",
        pattern: /^\/admin\/department(?:\/.*)?$/,
        roles: ["ADMIN", "PRODUCT_MANAGER"],
    },
    {
        title: "Job",
        icon: Blocks,
        url: "/admin/job?search=&sortorder=asc&page=1&perpage=100",
        pattern: /^\/admin\/job(?:\/.*)?$/,
        roles: ["ADMIN", "JOB_MANAGER"],
    },
    {
        title: "Dispatch",
        icon: Blocks,
        url: "/admin/dispatch?search=&sortorder=asc&page=1&perpage=100",
        pattern: /^\/admin\/dispatch(?:\/.*)?$/,
        roles: ["ADMIN", "DISPATCHER"],
    },
    {
        title: "Files",
        icon: UploadCloud,
        url: "/admin/file-upload?search=&sortorder=desc&orderStatus=ALL&page=1&perpage=100",
        pattern: /^\/admin\/file-upload(?:\/.*)?$/,
        roles: ["ADMIN", "ORDER_MANAGER"],
    },
    {
        title: "Orders",
        icon: ShoppingCart,
        url: "/admin/orders?search=&sortorder=desc&orderStatus=ALL&page=1&perpage=100",
        pattern: /^\/admin\/orders(?:\/.*)?$/,
        roles: ["ADMIN", "ORDER_MANAGER"],
    },
    {
        title: "Distribution",
        icon: Package,
        url: "/admin/distribution?search=&sortorder=desc&orderStatus=ALL&page=1&perpage=100",
        pattern: /^\/admin\/distribution(?:\/.*)?$/,
        roles: ["DISTRIBUTER"],
    },
    {
        title: "D Category",
        icon: Frame,
        url: "/admin/design-category?search=&sortorder=asc&page=1&perpage=100",
        pattern: /^\/admin\/design-category(?:\/.*)?$/,
        roles: ["ADMIN", "PRODUCT_MANAGER"],
    },
    {
        title: "Designs",
        icon: PictureInPicture,
        url: "/admin/design-items?search=&sortorder=asc&page=1&perpage=100",
        pattern: /^\/admin\/design-items(?:\/.*)?$/,
        roles: ["ADMIN", "PRODUCT_MANAGER"],
    },
];

export const getFilteredRoutes = (session: Session | null) => {
    return routes.filter((item) =>
        item.roles.includes(session?.user?.staff?.role ?? "STAFF"),
    );
};
