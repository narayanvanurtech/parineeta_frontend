import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  FileText,
  Calculator,
  Settings,
  ChevronDown,
  Tags,
  Truck,
  MessageSquare,
  Percent,
  Crown
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationGroups = [
  {
    label: "Dashboard Hub",
    items: [
      { title: "Overview", url: "/admin", icon: LayoutDashboard, badge: null },
    ]
  },
  {
    label: "Product Operations", 
    items: [
      { title: "Product Management", url: "/admin/products", icon: Package, badge: 12 },
      { title: "Categories & Attributes", url: "/admin/categories", icon: Tags, badge: null },
      { title: "Variant Management", url: "/admin/variant", icon:Package , badge: null },
    ]
  },
  {
    label: "Order Fulfillment",
    items: [
      { title: "Order Management", url: "/admin/orders", icon: ShoppingCart, badge: 8 },
      { title: "Shipping Management", url: "/admin/shipping", icon: Truck, badge: 3 },
    ]
  },
  {
    label: "Customer Relations", 
    items: [
      { title: "Customer Management", url: "/admin/customers", icon: Users, badge: null },
      { title: "Review Management", url: "/admin/reviews", icon: MessageSquare, badge: 5 },
    ]
  },
  {
  label: "Ziba Boutique",
  items: [
    {
      title: "Ziba Boutique Customers",
      url: "/admin/ziva",
      icon: Users,
      badge: null,
    },
     {
      title: "subject",
      url: "/admin/zivaSubject",
      icon: Users,
      badge: null,
    },
  ],
}
,
  {
    label: "Business Intelligence",
    items: [
      { title: "Reports & Analytics", url: "/admin/reports", icon: BarChart3, badge: null },
      { title: "Offers & Discounts", url: "/admin/offers", icon: Percent, badge: 2 },
    ]
  },
  {
    label: "Content & Finance",
    items: [
      { title: "Content Management", url: "/admin/cms", icon: FileText, badge: null },
      { title: "Tax & GST Setup", url: "/admin/tax", icon: Calculator, badge: null },
    ]
  },
  {
    label: "System Administration",
    items: [
      { title: "Role-Based Access", url: "/admin/roles", icon: Settings, badge: null },
    ]
  }
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Dashboard Hub']));
  const collapsed = state === "collapsed";

  const toggleGroup = (groupLabel: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupLabel)) {
      newExpanded.delete(groupLabel);
    } else {
      newExpanded.add(groupLabel);
    }
    setExpandedGroups(newExpanded);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className={cn(
      "border-r border-border bg-card transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <SidebarContent className="px-2 py-4">
        {/* Logo Section */}
        <div className="px-4 py-6 border-b border-border mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Crown className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold text-foreground">Pareenita</h1>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Groups */}
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.label} className="mb-2">
            <SidebarGroupLabel 
              className={cn(
                "flex items-center justify-between cursor-pointer hover:bg-accent rounded-md px-2 py-1 transition-colors",
                !collapsed && "text-xs font-medium text-muted-foreground uppercase tracking-wide"
              )}
              onClick={() => !collapsed && toggleGroup(group.label)}
            >
              {!collapsed ? (
                <>
                  <span>{group.label}</span>
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform",
                    expandedGroups.has(group.label) ? "rotate-180" : ""
                  )} />
                </>
              ) : (
                <div className="w-2 h-2 bg-muted rounded-full" />
              )}
            </SidebarGroupLabel>

            {(collapsed || expandedGroups.has(group.label)) && (
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group",
                            isActive(item.url)
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "hover:bg-accent hover:text-accent-foreground"
                          )}
                        >
                          <item.icon className={cn(
                            "w-5 h-5 transition-colors",
                            isActive(item.url) ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground"
                          )} />
                          {!collapsed && (
                            <>
                              <span className="font-medium ">{item.title}</span>
                              {item.badge && (
                                <Badge variant="destructive" className="ml-auto text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}