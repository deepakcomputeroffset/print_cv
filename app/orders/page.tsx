"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

type OrderStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";

interface Order {
  id: string;
  productId: string;
  product: {
    name: string;
    imageUrl: string[];
  };
  quantity: number;
  amount: number;
  templateUrl?: string;
  status: OrderStatus;
  createdAt: string;
}

export default function OrdersPage() {
  // Dummy data matching the new schema
  const [orders] = useState<Order[]>([
    {
      id: "ORD001",
      productId: "prod1",
      product: {
        name: "Business Cards",
        imageUrl: [
          "https://images.unsplash.com/photo-1606293926075-69a00dbfde81",
        ],
      },
      quantity: 500,
      amount: 149.99,
      templateUrl: "template-url-1",
      status: "PENDING",
      createdAt: "2024-01-15",
    },
    {
      id: "ORD002",
      productId: "prod2",
      product: {
        name: "Large Format Banner",
        imageUrl: [
          "https://images.unsplash.com/photo-1589384267710-7a170981ca78",
        ],
      },
      quantity: 2,
      amount: 299.99,
      templateUrl: "template-url-2",
      status: "COMPLETED",
      createdAt: "2024-01-10",
    },
    {
      id: "ORD003",
      productId: "prod3",
      product: {
        name: "Product Brochures",
        imageUrl: [
          "https://images.unsplash.com/photo-1531973576160-7125cd663d86",
        ],
      },
      quantity: 1000,
      amount: 599.99,
      templateUrl: "template-url-3",
      status: "PROCESSING",
      createdAt: "2024-01-14",
    },
    {
      id: "ORD004",
      productId: "prod4",
      product: {
        name: "Event Flyers",
        imageUrl: [
          "https://images.unsplash.com/photo-1572025442646-866d16c84a54",
        ],
      },
      quantity: 2500,
      amount: 399.99,
      templateUrl: "template-url-4",
      status: "CANCELLED",
      createdAt: "2024-01-08",
    },
    {
      id: "ORD005",
      productId: "prod5",
      product: {
        name: "Business Cards Premium",
        imageUrl: [
          "https://images.unsplash.com/photo-1606293926075-69a00dbfde81",
        ],
      },
      quantity: 250,
      amount: 89.99,
      templateUrl: "template-url-5",
      status: "COMPLETED",
      createdAt: "2024-01-05",
    },
  ]);

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PROCESSING: "bg-blue-100 text-blue-800",
      COMPLETED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return colors[status];
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.product.name}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>${order.amount}</TableCell>
                <TableCell>
                  {format(new Date(order.createdAt), "dd/MM/yyyy")}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/orders/${order.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
