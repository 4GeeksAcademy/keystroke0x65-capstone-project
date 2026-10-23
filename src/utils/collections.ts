import { Carrier, Product, ProductCategory, WarehouseLocation } from "../types/models";
import { validateCarriersArray, validateProductsArray } from "./validations";



// Returns products in the specified warehouse
export function filterProductsByWarehouse(products: Product[], warehouse: WarehouseLocation): Product[] {

    validateProductsArray(products);
    
    let productsInGivenWarehouse: Product[] = [];
    
    for(let i = 0; i < products.length; i++){
        if(products[i].warehouse === warehouse){
            productsInGivenWarehouse.push(products[i]);
        }
    }

    return productsInGivenWarehouse;
}

// Returns products in the specified category
export function filterProductsByCategory(products: Product[], category: ProductCategory): Product[]{

    validateProductsArray(products);

    let productsInCategory: Product[] = [];
    
    for(let i = 0; i < products.length; i++){
        if(products[i].category === category){
            productsInCategory.push(products[i]);
        }
    }

    return productsInCategory;
}

// Returns products where stockQuantity <= minStockThreshold
export function filterLowStockProducts(products: Product[]): Product[]{

    validateProductsArray(products);

    let productsSupplyTooLow: Product[] = [];
    
    for(let i = 0; i < products.length; i++){
        if(products[i].stockQuantity <= products[i].minStockThreshold){
            productsSupplyTooLow.push(products[i]);
        }
    }

    return productsSupplyTooLow;
}

// Returns products sorted by stock quantity && doesn't mutate the original array
export function sortProductsByStock(products: Product[], order: "asc" | "desc"): Product[]{

    validateProductsArray(products);

    let productsSorted: Product[] = [...products];
    
    if(order == "asc"){
        productsSorted.sort((a,b)=> a.stockQuantity - b.stockQuantity);
    }else if(order == "desc"){
        productsSorted.sort((a,b)=> b.stockQuantity - a.stockQuantity);
    }
    return productsSorted;
}

// Returns carriers sorted by on-time rate && doesn't mutate the original array
export function sortCarriersByReliability(carriers: Carrier[], order: "asc" | "desc"): Carrier[]{

    validateCarriersArray(carriers);

    let carriersSorted: Carrier[] = [...carriers];
    
    if(order == "asc"){
        carriersSorted.sort((a,b)=> a.onTimeRate - b.onTimeRate);
    }else if(order == "desc"){
        carriersSorted.sort((a,b)=> b.onTimeRate - a.onTimeRate);
    }
    return carriersSorted;
}