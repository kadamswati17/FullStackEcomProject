export interface Coupon {
    id: number;
    code: string;
    discount: number;
    isPublic?: boolean; // optional if not always available
}
