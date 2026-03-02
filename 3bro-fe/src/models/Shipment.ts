export type Shipment = {
    id: number;
    orderId: string;
    shipmentName: string;
    trackingNumber: string;
    shipDate: string | null;
    deliveryDate: string | null;
    status: string;
}