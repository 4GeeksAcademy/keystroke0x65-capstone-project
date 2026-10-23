import { Product, Shipment, Carrier, ShipmentStatus, ProductCategory } from '../types/models';

export function checkCarrier(carrier: Carrier): void {
    let validation = validateCarrier(carrier);

    if (!validation.valid) {
        throw new Error( `Carrier invalid: ${validation.errors.join(", ")}` );
    }
}

export function checkShipment(shipment: Shipment){
    let validation = validateShipment(shipment);

    if (!validation.valid) {
        throw new Error( `Shipment invalid: ${validation.errors.join(", ")}` );
    }
}

export function checkProduct(product: Product){
    let validation = validateProduct(product);

    if (!validation.valid) {
        throw new Error( `Product invalid: ${validation.errors.join(", ")}` );
    }
}

export function validateProductsArray(products: Product[]){

    if(products.length === 0){
        throw new Error("products array is length 0");
    }
        
}

export function validateCarriersArray(carriers: Carrier[]) {
   
    if (carriers.length === 0) {
        throw new Error("carriers array is length 0");
    }

}

export function validateShipmentsArray(shipments: Shipment[]) {

    if (shipments.length === 0) {
        throw new Error("shipments array is length 0");
    }
    
}


/*
    - Validates all business rules for a product
    - Returns an object with:
        valid: true if all validations pass, false otherwise
        errors: array of error messages (empty if valid)
*/
export function validateProduct(product: Product): { valid: boolean, errors: string[] } {
    
    let valid = true;
    let errors:string[] = [];

    if(product.sku == null || product.sku.length === 0){
        valid = false;
        errors.push("sku is null");
    }
     if(product.weightKg <= 0 || product.weightKg > 100){
        valid = false;
        errors.push("weightKg must be > 0 and <= 100");
    }

    if( product.dimensions.lengthCm <= 0 || product.dimensions.lengthCm > 200 ){
        valid = false;
        errors.push("lengthCm must be > 0 and <= 200");
    }

    if( product.dimensions.widthCm <= 0 || product.dimensions.widthCm > 200 ){
        valid = false;
        errors.push("widthCm must be > 0 and <= 200");
    }

    if( product.dimensions.heightCm <= 0 || product.dimensions.heightCm > 200 ){
        valid = false;
        errors.push("heightCm must be > 0 and <= 200");
    }

    if(product.stockQuantity < 0){
        valid = false;
        errors.push("stockQuantity must be >= 0");
    }

    if(product.minStockThreshold < 0){
        valid = false;
        errors.push("minStockThreshold must be >= 0");
    }

    if(product.unitCostUSD <= 0){
        valid = false;
        errors.push("unitCostUSD must be > 0");
    }
    
    
    return { valid, errors };
}

/*
    - Validates all business rules for a shipment
    - Returns an object with:
        valid: true if all validations pass, false otherwise
        errors: array of error messages (empty if valid)
*/
export function validateShipment(shipment: Shipment): { valid: boolean, errors: string[] } {
    let valid = true;
    let errors:string[] = [];

    if(shipment.quantity <= 0){
        valid = false;
        errors.push("quantity must be > 0");
    }

    if(shipment.declaredValueUSD <= 0){
        valid = false;
        errors.push("declaredValueUSD must be > 0");
    }

    if(shipment.destination.distanceKm < 0){
        valid = false;
        errors.push("distanceKm must be > 0");
    }


    return { valid, errors };
}

/*
    - Validates all business rules for a carrier
    - Returns an object with:
        valid: true if all validations pass, false otherwise
        errors: array of error messages (empty if valid)
*/
export function validateCarrier(carrier: Carrier): { valid: boolean, errors: string[] } {
    let valid = true;
    let errors:string[] = [];

    if(carrier.baseRateUSD < 0){
        valid = false;
        errors.push("baseRateUSD must be >= 0");
    }

    if(carrier.ratePerKgUSD < 0){
        valid = false;
        errors.push("ratePerKgUSD must be >= 0");
    }

    if(carrier.ratePerKmUSD < 0){
        valid = false;
        errors.push("ratePerKmUSD must be >= 0");
    }

    if(carrier.avgDeliveryDays <= 0){
        valid = false;
        errors.push("avgDeliveryDays must be > 0");
    }

    if(carrier.avgDeliveryDays <= 0){
        valid = false;
        errors.push("avgDeliveryDays must be > 0");
    }

    if(carrier.onTimeRate < 0 || carrier.onTimeRate > 100){
        valid = false;
        errors.push("onTimeRate must be between 0 and 100");
    }

    if(carrier.maxWeightKg <= 0){
        valid = false;
        errors.push("maxWeightKg must be > 0");
    }

    if(carrier.operatesIn.length < 1){
        valid = false;
        errors.push("operatesIn must contain at least 1 country");
    }

    return { valid, errors };
}