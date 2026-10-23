

/*
    Validation Rules for Product:

    sku must not be empty
    weightKg must be > 0 and <= 100
    All dimensions must be > 0 and <= 200
    stockQuantity must be >= 0
    minStockThreshold must be >= 0
    unitCostUSD must be > 0
*/

// Representation of a product stored in TrackFlow's warehouses.
export interface Product {
  sku: string; // Stock Keeping Unit (e.g., "SHOE-BLK-42")
  name: string; // Product name
  category: ProductCategory; // Product category
  weightKg: number; // Weight in kilograms
  dimensions: Dimensions; // Length, width, height in cm
  warehouse: WarehouseLocation; // Current warehouse
  stockQuantity: number; // Available units
  minStockThreshold: number; // Minimum stock before alert
  unitCostUSD: number; // Cost per unit in USD
  isFragile: boolean; // Requires special handling
  status: ProductStatus; // Current status
}

export interface Dimensions {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
}

export type ProductCategory =
  | "Fashion"
  | "Electronics"
  | "Cosmetics"
  | "Home"
  | "Other";
export type WarehouseLocation = "Los Angeles" | "Zaragoza";
export type ProductStatus = "Active" | "Low stock" | "Out of stock" | "Discontinued";


/**
    Validation Rules for Shipment:

    quantity must be > 0
    declaredValueUSD must be > 0
    distanceKm must be >= 0
 */

// Representation of a delivery order that needs to be shipped to a customer.
export interface Shipment {
  id: string; // Unique shipment ID (e.g., "SH-2024-8821")
  sku: string; // Product SKU being shipped
  quantity: number; // Number of units
  origin: WarehouseLocation; // Origin warehouse
  destination: Destination; // Delivery destination
  priority: ShipmentPriority; // Urgency level
  declaredValueUSD: number; // Declared value for insurance
  carrier: string | null; // Assigned carrier (null if not assigned)
  status: ShipmentStatus; // Current status
  createdAt: Date; // Order creation date
}

export interface Destination {
  city: string;
  country: Country;
  postalCode: string;
  distanceKm: number; // Distance from origin warehouse
}

export type Country = "United States" | "Spain";
export type ShipmentPriority = "Standard" | "Express" | "Same-day";
export type ShipmentStatus =
  | "Pending"
  | "Assigned"
  | "In transit"
  | "Delivered"
  | "Failed";

/**
    Validation Rules for Carrier:

    baseRateUSD, ratePerKgUSD, ratePerKmUSD must all be >= 0
    avgDeliveryDays must be > 0
    onTimeRate must be between 0 and 100
    maxWeightKg must be > 0
    operatesIn must contain at least 1 country
 */

// Representation of a delivery carrier that TrackFlow works with
export interface Carrier {
  id: string; // Carrier ID (e.g., "CAR-UPS")
  name: string; // Carrier name (e.g., "UPS")
  operatesIn: Country[]; // Countries where they operate
  baseRateUSD: number; // Base delivery cost (USD)
  ratePerKgUSD: number; // Additional cost per kg (USD)
  ratePerKmUSD: number; // Additional cost per km (USD)
  avgDeliveryDays: number; // Average delivery time in days
  onTimeRate: number; // On-time delivery rate (0-100)
  maxWeightKg: number; // Maximum package weight they accept
  handlesFragile: boolean; // Can handle fragile items
  acceptsPriority: ShipmentPriority[]; // Priorities they support
}


// Tracks inventory changes (inbound or outbound)
export interface InventoryMovement {
  id: string; // Movement ID
  sku: string; // Product SKU
  warehouse: WarehouseLocation; // Warehouse location
  type: MovementType; // Inbound or outbound
  quantity: number; // Number of units moved
  reason: string; // Reason for movement
  timestamp: Date; // When it happened
}

export type MovementType = "Inbound" | "Outbound" | "Transfer" | "Adjustment";