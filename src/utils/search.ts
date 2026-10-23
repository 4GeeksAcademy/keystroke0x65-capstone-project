import { Product, Shipment } from '../types/models';
import { validateProduct, validateProductsArray, validateShipment } from './validations';


// Performs linear search to find a product by SKU, case-insensitive comparison
export function findProductBySKU(products: Product[], sku: string): Product | null {

    validateProductsArray(products);

    for(let i = 0; i < products.length; i++){
        if(validateProduct(products[i]).valid && products[i].sku == sku){
            return products[i];
        }
    }

    return null;
}

// Performs linear search to find a shipment by ID
export function findShipmentById(shipments: Shipment[], id: string): Shipment | null {

    for(let i = 0; i < shipments.length; i++){
        if(validateShipment(shipments[i]).valid && shipments[i].id == id){
            return shipments[i];
        }
    }

    return null;
}

// Performs binary search to find the index of a product with the target weight
export function binarySearchProductByWeight(sortedProducts: Product[], targetWeight: number): number {
    //console.log(sortedProducts)
    validateProductsArray(sortedProducts);
    
    if(targetWeight <= 0){
        throw new Error("targetWeight must be greater than 0");
    }


    let min = 0;
    let max = sortedProducts.length -1;

    while(min <= max){
        let mid = min + (max - min)/2;
        //console.log(mid)
        if (sortedProducts[mid].weightKg == targetWeight){
            return mid;
        }else if (sortedProducts[mid].weightKg < targetWeight){
            min = mid + 1;
        }else{
            max = mid - 1;
        }

    }
    return -1;
}