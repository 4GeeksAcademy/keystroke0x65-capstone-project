import { Product, Carrier, Shipment } from './types/models';
import { filterProductsByCategory, filterProductsByWarehouse, sortCarriersByReliability, sortProductsByStock } from './utils/collections';
import { findProductBySKU, findShipmentById, binarySearchProductByWeight} from './utils/search';
import { countProductsByCategory, calculateTotalInventoryValue, calculateAverageShipmentDistance, groupShipmentsByStatus, findTopCarriers, calculateShippingCost, scoreCarrierForShipment, selectBestCarrier } from './utils/transformations';
import { validateCarrier, validateProduct, validateShipment } from './utils/validations';

const sampleProducts: Product[] = [
  {
    sku: "SHOE-BLK-42",
    name: "Black Running Shoes - Size 42",
    category: "Fashion",
    weightKg: 0.80,
    dimensions: { lengthCm: 35, widthCm: 22, heightCm: 12 },
    warehouse: "Los Angeles",
    stockQuantity: 45,
    minStockThreshold: 20,
    unitCostUSD: 35.0,
    isFragile: false,
    status: "Active",
  },
  {
    sku: "LAPTOP-DELL-15",
    name: "Dell Laptop 15 inch",
    category: "Electronics",
    weightKg: 2.3,
    dimensions: { lengthCm: 40, widthCm: 28, heightCm: 3 },
    warehouse: "Zaragoza",
    stockQuantity: 8,
    minStockThreshold: 10,
    unitCostUSD: 650.0,
    isFragile: true,
    status: "Low stock",
  },
  {
    sku: "PERFUME-COCO-50",
    name: "Coco Perfume 50ml",
    category: "Cosmetics",
    weightKg: 0.30,
    dimensions: { lengthCm: 12, widthCm: 8, heightCm: 15 },
    warehouse: "Los Angeles",
    stockQuantity: 120,
    minStockThreshold: 30,
    unitCostUSD: 85.0,
    isFragile: true,
    status: "Active",
  },
];

const sampleCarriers: Carrier[] = [
  {
    id: "CAR-UPS",
    name: "UPS",
    operatesIn: ["United States"],
    baseRateUSD: 5.0,
    ratePerKgUSD: 1.2,
    ratePerKmUSD: 0.05,
    avgDeliveryDays: 3,
    onTimeRate: 88,
    maxWeightKg: 30,
    handlesFragile: true,
    acceptsPriority: ["Standard", "Express"],
  },
  {
    id: "CAR-SEUR",
    name: "SEUR",
    operatesIn: ["Spain"],
    baseRateUSD: 6.5,
    ratePerKgUSD: 1.5,
    ratePerKmUSD: 0.08,
    avgDeliveryDays: 2,
    onTimeRate: 92,
    maxWeightKg: 25,
    handlesFragile: true,
    acceptsPriority: ["Standard", "Express", "Same-day"],
  },
  {
    id: "CAR-DHL",
    name: "DHL Express",
    operatesIn: ["United States", "Spain"],
    baseRateUSD: 12.0,
    ratePerKgUSD: 2.0,
    ratePerKmUSD: 0.1,
    avgDeliveryDays: 1,
    onTimeRate: 95,
    maxWeightKg: 50,
    handlesFragile: true,
    acceptsPriority: ["Express", "Same-day"],
  },
];

const sampleShipment: Shipment[] = [
  {
    id: "SH-2024-8821",
    sku: "LAPTOP-DELL-15",
    quantity: 1,
    origin: "Zaragoza",
    destination: {
      city: "Madrid",
      country: "Spain",
      postalCode: "28001",
      distanceKm: 320,
    },
    priority: "Express",
    declaredValueUSD: 650.0,
    carrier: null,
    status: "Pending",
    createdAt: new Date("2024-03-15"),
  },
  {
    id: "SH-2024-8822",
    sku: "SHOE-BLK-42",
    quantity: 2,
    origin: "Los Angeles",
    destination: {
      city: "San Francisco",
      country: "United States",
      postalCode: "94105",
      distanceKm: 615,
    },
    priority: "Standard",
    declaredValueUSD: 70.0,
    carrier: "UPS",
    status: "In transit",
    createdAt: new Date("2024-03-16"),
  },
  {
    id: "SH-2024-8823",
    sku: "PERFUME-COCO-50",
    quantity: 1,
    origin: "Zaragoza",
    destination: {
      city: "Barcelona",
      country: "Spain",
      postalCode: "08001",
      distanceKm: 300,
    },
    priority: "Same-day",
    declaredValueUSD: 85.0,
    carrier: "SEUR",
    status: "Delivered",
    createdAt: new Date("2024-03-17"),
  },
  {
    id: "SH-2024-8824",
    sku: "LAPTOP-DELL-15",
    quantity: 1,
    origin: "Zaragoza",
    destination: {
      city: "Valencia",
      country: "Spain",
      postalCode: "46001",
      distanceKm: 310,
    },
    priority: "Express",
    declaredValueUSD: 650.0,
    carrier: null,
    status: "Assigned",
    createdAt: new Date("2024-03-18"),
  },
  {
    id: "SH-2024-8825",
    sku: "SHOE-BLK-42",
    quantity: 1,
    origin: "Los Angeles",
    destination: {
      city: "Seattle",
      country: "United States",
      postalCode: "98101",
      distanceKm: 1545,
    },
    priority: "Express",
    declaredValueUSD: 35.0,
    carrier: "DHL Express",
    status: "Assigned",
    createdAt: new Date("2024-03-19"),
  },
  {
    id: "SH-2024-8826",
    sku: "PERFUME-COCO-50",
    quantity: 2,
    origin: "Zaragoza",
    destination: {
      city: "Madrid",
      country: "Spain",
      postalCode: "28013",
      distanceKm: 320,
    },
    priority: "Standard",
    declaredValueUSD: 170.0,
    carrier: "SEUR",
    status: "In transit",
    createdAt: new Date("2024-03-20"),
  }
];


console.log("------------------ TESTING COLLECTIONS OPERATIONS --------------------------");

console.log( "Testing filterProductsByWarehouse LA");
console.log( filterProductsByWarehouse(sampleProducts, "Los Angeles") );

console.log( "Testing filterProductsByWarehouse Zaragoza");
console.log( filterProductsByWarehouse(sampleProducts, "Zaragoza") );

console.log( "Testing filterProductsByCategory Cosmetics");
console.log( filterProductsByCategory(sampleProducts, "Cosmetics") );

console.log( "Testing filterProductsByCategory Fashion");
console.log( filterProductsByCategory(sampleProducts, "Fashion") );

console.log( "Testing filterProductsByCategory Electronics");
console.log( filterProductsByCategory(sampleProducts, "Electronics") );

console.log( "Testing filterProductsByCategory Home");
console.log( filterProductsByCategory(sampleProducts, "Home") );

console.log( "Testing filterProductsByCategory Other");
console.log( filterProductsByCategory(sampleProducts, "Other") );

console.log( "Testing sortProductsByStock Asc");
console.log( sortProductsByStock(sampleProducts, "asc"));

console.log( "Testing sortProductsByStock Desc");
console.log( sortProductsByStock(sampleProducts, "desc"));

console.log( "Testing sortCarriersByReliability Asc");
console.log( sortCarriersByReliability(sampleCarriers, "asc"));

console.log( "Testing sortCarriersByReliability Desc");
console.log( sortCarriersByReliability(sampleCarriers, "desc"));

console.log("------------------ END OF TESTING COLLECTIONS OPERATIONS --------------------------");

console.log("------------------ TESTING SEARCH OPERATIONS --------------------------");

console.log( "Testing findProductBySKU SHOE-BLK-42" );
console.log( findProductBySKU(sampleProducts, "SHOE-BLK-42"));

console.log( "Testing findShipmentById SHOE-BLK-42" );
console.log( findShipmentById(sampleShipment, "SH-2024-8821"));


let sortedProducts:Product[] = [...sampleProducts];
sortedProducts.sort((a,b)=>a.weightKg - b.weightKg);

console.log( "Testing binarySearchProductByWeight 2.3kg" );
console.log( binarySearchProductByWeight(sortedProducts, 2.3));

console.log( "Testing binarySearchProductByWeight 0.3kg" );
console.log( binarySearchProductByWeight(sortedProducts, 0.3));

console.log( "Testing binarySearchProductByWeight 0.8kg" );
console.log( binarySearchProductByWeight(sortedProducts, 0.8));

console.log( "Testing binarySearchProductByWeight 69kg" );
console.log( binarySearchProductByWeight(sortedProducts, 69));

console.log("------------------END OF TESTING SEARCH OPERATIONS --------------------------");

console.log("------------------TESTING CARRIER SCORING AND COST CALCULATIONS --------------------------");

console.log( "Testing calculateShippingCost sampleShipment[0] sampleProducts[0] sampleCarrier[0]" );
console.log( calculateShippingCost(sampleShipment[0], sampleProducts[0], sampleCarriers[0]));

console.log( "Testing scoreCarrierForShipment sampleCarriers[1] sampleShipment[1] sampleProducts[1]" );
console.log( scoreCarrierForShipment(sampleCarriers[1], sampleShipment[1], sampleProducts[1], ));

console.log( "Testing selectBestCarrier sampleCarriers, sampleShipment[2], sampleProducts[2]" );
console.log( selectBestCarrier(sampleCarriers, sampleShipment[2], sampleProducts[2]));


console.log("------------------END OF TESTING CARRIER SCORING AND COST CALCULATIONS --------------------------");




console.log("------------------TESTING AGGREGATIONS & REPORTS --------------------------");

console.log( "Testing countProductsByCategory" );
console.log( countProductsByCategory(sampleProducts));

console.log( "Testing calculateTotalInventoryValue" );
console.log( calculateTotalInventoryValue(sampleProducts));

console.log( "Testing calculateAverageShipmentDistance" );
console.log( calculateAverageShipmentDistance(sampleShipment));

console.log( "Testing groupShipmentsByStatus" );
console.log( groupShipmentsByStatus(sampleShipment));

console.log( "Testing findTopCarriers 3" );
console.log( findTopCarriers(sampleShipment, 3));

console.log( "Testing findTopCarriers 1" );
console.log( findTopCarriers(sampleShipment, 1));

console.log( "Testing findTopCarriers 10" );
console.log( findTopCarriers(sampleShipment, 10));

//console.log( "Testing findTopCarriers -1" );
//console.log( findTopCarriers(sampleShipment, -1));

console.log("------------------END OF TESTING AGGREGATIONS & REPORTS --------------------------");

console.log("------------------TESTING VALIDATIONS  --------------------------");

console.log( "Testing validateProduct" );
console.log( validateProduct(sampleProducts[0]));

console.log( "Testing validateShipment" );
console.log( validateShipment(sampleShipment[0]));

console.log( "Testing validateCarrier" );
console.log( validateCarrier(sampleCarriers[0]));


console.log("------------------END OF TESTING VALIDATIONS --------------------------");

