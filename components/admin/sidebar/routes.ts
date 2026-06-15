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
    Send,
    Users,
    Inbox,
    Truck,
    FolderOpen,
} from "lucide-react";
import { Session } from "next-auth";

export type RouteGroup =
    | "main"
    | "people"
    | "catalog"
    | "operations"
    | "content";

export const groupLabels: Record<RouteGroup, string> = {
    main: "Main",
    people: "People",
    catalog: "Catalog",
    operations: "Operations",
    content: "Content",
};

export type RouteType = {
    title: string;
    icon: React.ElementType;
    url: string;
    pattern: RegExp;
    roles: ROLE[];
    group: RouteGroup;
};

export const routes: RouteType[] = [
    {
        title: "Home",
        icon: Home,
        url: "/",
        pattern: /^\/$/,
        roles: ["ADMIN", "STAFF"],
        group: "main",
    },
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: "/admin",
        pattern: /^\/admin$/,
        roles: ["ADMIN", "STAFF"],
        group: "main",
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
        group: "main",
    },
    {
        title: "Staffs",
        icon: Users,
        url: "/admin/staff?search=&sortorder=asc&perpage=100",
        pattern: /^\/admin\/staff(?:\/.*)?$/, // Matches /admin/staff and any nested route
        roles: ["ADMIN"],
        group: "people",
    },
    {
        title: "C.Category",
        icon: FolderOpen,
        url: "/admin/customer-category",
        pattern: /^\/admin\/customer-category(?:\/.*)?$/,
        roles: ["ADMIN"],
        group: "people",
    },
    {
        title: "Customers",
        icon: Users,
        url: "/admin/customer?search=&sortorder=asc&perpage=100",
        pattern: /^\/admin\/customer(?:\/.*)?$/,
        roles: ["ADMIN"],
        group: "people",
    },
    {
        title: "Wallet",
        icon: PiggyBank,
        url: "/admin/wallet?search=&sortorder=asc&perpage=100",
        pattern: /^\/admin\/wallet(?:\/.*)?$/,
        roles: ["ADMIN", "ACCOUNTANT"],
        group: "people",
    },
    {
        title: "Category",
        icon: ShoppingBag,
        url: "/admin/category?search=&sortorder=asc&perpage=100",
        pattern: /^\/admin\/category(?:\/.*)?$/,
        roles: ["ADMIN", "PRODUCT_MANAGER"],
        group: "catalog",
    },
    {
        title: "Products",
        icon: Package,
        url: "/admin/products?search=&sortorder=asc&perpage=100",
        pattern: /^\/admin\/products(?:\/.*)?$/,
        roles: ["ADMIN", "PRODUCT_MANAGER"],
        group: "catalog",
    },
    {
        title: "Department",
        icon: Blocks,
        url: "/admin/department?search=&sortorder=asc&page=1&perpage=100",
        pattern: /^\/admin\/department(?:\/.*)?$/,
        roles: ["ADMIN", "PRODUCT_MANAGER"],
        group: "catalog",
    },
    {
        title: "D Category",
        icon: Frame,
        url: "/admin/design-category?search=&sortorder=asc&page=1&perpage=100",
        pattern: /^\/admin\/design-category(?:\/.*)?$/,
        roles: ["ADMIN", "PRODUCT_MANAGER"],
        group: "catalog",
    },
    {
        title: "Designs",
        icon: PictureInPicture,
        url: "/admin/design-items?search=&sortorder=asc&page=1&perpage=100",
        pattern: /^\/admin\/design-items(?:\/.*)?$/,
        roles: ["ADMIN", "PRODUCT_MANAGER"],
        group: "catalog",
    },
    {
        title: "Orders",
        icon: ShoppingCart,
        url: "/admin/orders?search=&sortorder=desc&orderStatus=ALL&page=1&perpage=100",
        pattern: /^\/admin\/orders(?:\/.*)?$/,
        roles: ["ADMIN", "ORDER_MANAGER"],
        group: "operations",
    },
    {
        title: "Dispatch",
        icon: Send,
        url: "/admin/dispatch?search=&sortorder=asc&page=1&perpage=100",
        pattern: /^\/admin\/dispatch(?:\/.*)?$/,
        roles: ["ADMIN", "DISPATCHER"],
        group: "operations",
    },
    {
        title: "Job",
        icon: Blocks,
        url: "/admin/job?search=&sortorder=asc&page=1&perpage=100",
        pattern: /^\/admin\/job(?:\/.*)?$/,
        roles: ["ADMIN", "JOB_MANAGER"],
        group: "operations",
    },
    {
        title: "Review Orders",
        icon: Inbox,
        url: "/admin/review?search=&sortorder=desc&orderStatus=ALL&page=1&perpage=100",
        pattern: /^\/admin\/review(?:\/.*)?$/,
        roles: ["ADMIN", "ORDER_MANAGER"],
        group: "operations",
    },
    {
        title: "Distribution",
        icon: Truck,
        url: "/admin/distribution?search=&sortorder=desc&orderStatus=ALL&page=1&perpage=100",
        pattern: /^\/admin\/distribution(?:\/.*)?$/,
        roles: ["DISTRIBUTER", "ADMIN"],
        group: "operations",
    },
    {
        title: "Carousels",
        icon: PictureInPicture,
        url: "/admin/carousel?search=&sortorder=asc&page=1&perpage=100",
        pattern: /^\/admin\/carousel(?:\/.*)?$/,
        roles: ["ADMIN"],
        group: "content",
    },
];

export const getFilteredRoutes = (session: Session | null) => {
    return routes.filter((item) =>
        item.roles.includes(session?.user?.staff?.role ?? "STAFF"),
    );
};
