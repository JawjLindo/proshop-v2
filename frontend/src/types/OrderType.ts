type OrderItemType = {
  _id: string;
  name: string;
  image: string;
  qty: number;
  price: number;
  product: string;
};

export type OrderType = {
  _id?: string;
  orderItems: OrderItemType[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  user?: {
    name: string;
    email: string;
  };
  isDelivered: boolean;
  deliveredAt: Date;
  isPaid: boolean;
  paidAt: Date;
  createdAt: Date;
};
