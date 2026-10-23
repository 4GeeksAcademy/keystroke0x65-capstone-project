import { Product, Shipment, Carrier, ShipmentStatus, ProductCategory } from '../types/models';
import { checkCarrier, checkProduct, checkShipment, validateCarrier, validateCarriersArray, validateProduct, validateProductsArray, validateShipment, validateShipmentsArray } from './validations';



// Calculates the total shipping cost based
export function calculateShippingCost(shipment: Shipment, product: Product, carrier: Carrier): number {

    checkCarrier(carrier);
    checkProduct(product);
    checkShipment(shipment);

    let totalCost = 0;

    totalCost += carrier.baseRateUSD;
    totalCost += product.weightKg * carrier.ratePerKgUSD * shipment.quantity;
    
    if(shipment.priority == "Express"){
        totalCost += (0.3*totalCost);
    }else if(shipment.priority == "Same-day"){
        totalCost += (0.6*totalCost);
    }

    return Number(totalCost.toFixed(2));
}

// Calculates a suitability score (0-100) for a carrier 
export function scoreCarrierForShipment(carrier: Carrier, shipment: Shipment, product: Product): number {

    checkCarrier(carrier);
    checkProduct(product);
    checkShipment(shipment);

    let suitabilityScore = 0;

    if(carrier.operatesIn.includes(shipment.destination.country)){
        suitabilityScore += 20;
    }

    if(product.weightKg * shipment.quantity <= carrier.maxWeightKg){
        suitabilityScore += 20;
    }

    if(carrier.acceptsPriority.includes(shipment.priority)){
        suitabilityScore += 15;
    }

    if(product.isFragile && carrier.handlesFragile){
        suitabilityScore += 15;
    }

    if(!product.isFragile){
        suitabilityScore += 15;
    }

    suitabilityScore = carrier.onTimeRate * 0.3

    return Number(suitabilityScore.toFixed(2));

}

//Returns the best carrier with its score and cost, or null if no suitable carrier found
export function selectBestCarrier(carriers: Carrier[], shipment: Shipment, product: Product): {carrier: Carrier, score: number, cost: number} | null {
    
    validateCarriersArray(carriers);
    checkProduct(product);
    checkShipment(shipment);


    let carrierSuitabilities:Array<{ carrier: Carrier; score: number, cost: number }> = [];

    for(let i = 0; i < carriers.length; i++){
        carrierSuitabilities.push({ 
                                    carrier: carriers[i], 
                                    score: scoreCarrierForShipment(carriers[i], shipment, product),
                                    cost: calculateShippingCost(shipment, product, carriers[i])
                                });
    }

    carrierSuitabilities.sort((a,b) => b.score - a.score);

    carrierSuitabilities = carrierSuitabilities.filter(a=>a.score >= 50);

    carrierSuitabilities.sort((a,b)=> a.cost - b.cost);

    if(carrierSuitabilities.length == 0){
        return null;
    }

    return carrierSuitabilities[0];

}

// Returns a count of products for each category
export function countProductsByCategory(products: Product[]): Record<ProductCategory, number> {

    validateProductsArray(products);

    let productsCounts: Record<ProductCategory, number> = {
        Fashion:0,
        Electronics:0,
        Cosmetics:0,
        Home:0,
        Other:0
    };

    for(let i = 0; i < products.length; i++){
        if(products[i].category == "Fashion"){
            productsCounts.Fashion++;
        }else if(products[i].category == "Electronics"){
            productsCounts.Electronics++;
        }else if(products[i].category == "Cosmetics"){
            productsCounts.Cosmetics++;
        }else if(products[i].category == "Home"){
            productsCounts.Home++;
        }else if(products[i].category == "Other"){
            productsCounts.Other++;
        }
    }
        

    return productsCounts;
}

// Returns the total value of all inventory, rounded to 2 dp
export function calculateTotalInventoryValue(products: Product[]): number {

    validateProductsArray(products);

    let sum:number = 0;

    for(let i = 0; i < products.length; i++){
        sum += products[i].stockQuantity * products[i].unitCostUSD;
    }

    return Number(sum.toFixed(2));
}

// Returns the average distance across all shipments
export function calculateAverageShipmentDistance(shipments: Shipment[]): number {

    validateShipmentsArray(shipments);

    let avgShipmentDistance = 0;

    for(let i = 0; i < shipments.length; i++){
        avgShipmentDistance += shipments[i].destination.distanceKm;
    }

    avgShipmentDistance /= shipments.length;

    return Number(avgShipmentDistance.toFixed(2));
}

// Returns an object where keys are statuses and values are arrays of shipments
export function groupShipmentsByStatus(shipments: Shipment[]): Record<ShipmentStatus, Shipment[]> {

    validateShipmentsArray(shipments);

    let shipmentsGroupedByStatus: Record<ShipmentStatus, Shipment[]> = {
        Pending: [],
        Assigned: [],
        "In transit": [],
        Delivered: [],
        Failed : []
    };

    for(let i = 0; i < shipments.length; i++){
        if(shipments[i].status == 'Pending'){
            shipmentsGroupedByStatus.Pending.push(shipments[i]);
        }else if(shipments[i].status == 'Assigned'){
            shipmentsGroupedByStatus.Assigned.push(shipments[i]);
        }else if(shipments[i].status == "In transit"){
            shipmentsGroupedByStatus['In transit'].push(shipments[i]);
        }else if(shipments[i].status == 'Delivered'){
            shipmentsGroupedByStatus.Delivered.push(shipments[i]);
        }else if(shipments[i].status == 'Failed'){
            shipmentsGroupedByStatus.Failed.push(shipments[i]);
        }
    }
        

    return shipmentsGroupedByStatus;
}

// Finds the N most used carriers based on assigned shipments
export function findTopCarriers(shipments: Shipment[], topN: number): Array<{carrier: string, count: number}> {

    if(topN < 1){
        throw new Error("topN can't be less than 1.");
    }
    
    validateShipmentsArray(shipments);
    
    let uniqueCarriers: Array<{carrier: string, count: number}> = [];

    for(let i = 0; i < shipments.length; i++){
        let carrier = shipments[i].carrier;
        //console.log(carrier);
        if(carrier){
            let doesCarrierExist = uniqueCarriers.find(c => c.carrier === carrier);
            //console.log(doesCarrierExist);
            if(doesCarrierExist !== undefined){
                doesCarrierExist.count++;
            }else{
                uniqueCarriers.push({ carrier: carrier, count:1 });
            }
        }
    }
    uniqueCarriers.sort((a,b)=>b.count - a.count);
    //console.log(JSON.stringify(uniqueCarriers, null, 2));

    return uniqueCarriers.slice(0, topN);
}