import { Events } from "./../sqlModels/events";
import { Order } from "../sqlModels/order";
import { Order_Match } from "../sqlModels/order_match";

export interface IGroupeOrder {
  id: number;
  name: string;
  event_id: number;
  createdAt: string;
  updatedAt: string;
  order: Order[];
  order_match: Order_Match[];
  events: Events;
}
