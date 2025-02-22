'use client'

import { Rating } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import SetColor from "./SetColor";
import SetQuantity from "./SetQuantity";
import Button from "./Button";
import ProductImage from "./ProductImage";
import { useCart } from "@/app/hooks/useCart";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { useRouter } from "next/navigation";

interface ProductDetailsProps {
    product: any;
}

export type CartProductType = {
    id: string,
    name: string,
    description: string,
    category: string,
    brand: string,
    selectedImg: SelectedImageType,
    quantity: number,
    price: number
}

export type SelectedImageType = {
    color: string,
    colorCode: string,
    image: string
}

const Horizontal = () => {
    return <hr className="w-[30%] my-2" />
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {

    const router = useRouter();

    const { handleAddProductToCart, cartProducts } = useCart();
    const [isProductInCart, setIsProductInCart] = useState(false);

    const [cartProduct, setCartProduct] = useState<CartProductType>({
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        brand: product.brand,
        selectedImg: { ...product.images[0] },
        quantity: 1,
        price: product.price,
    })

    useEffect(() => {
        setIsProductInCart(false);

        if (cartProducts) {
            const existingCart = cartProducts.findIndex((item) => item.id === product.id);

            if (existingCart > -1) {
                setIsProductInCart(true);
            }
        }

    }, [cartProducts])

    console.log(cartProduct)

    // getting the average reviews for our rating
    const productRating =
        product.reviews.reduce((acc: number, item: any) =>
            item.rating + acc, 0) /
        product.reviews.length;

    const handleColorSelect = useCallback(
        (value: SelectedImageType) => {
            setCartProduct((prev) => {
                return { ...prev, selectedImg: value }
            })
        },
        [cartProduct.selectedImg])

    const handleQtyIncrease = useCallback(() => {
        setCartProduct((prev) => {
            return { ...prev, quantity: ++prev.quantity }
        })
    }, [cartProduct])

    const handleQtyDecrease = useCallback(() => {

        if (cartProduct.quantity === 1) {
            return;
        }

        setCartProduct((prev) => {
            return { ...prev, quantity: --prev.quantity }
        })
    }, [cartProduct])


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ProductImage cartProduct={cartProduct} product={product} handleColorSelect={handleColorSelect} />
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-medium text-slate-700">{product.name}</h2>
                <div className="flex items-center gap-2">
                    <Rating value={productRating} readOnly />
                    <div>
                        {product.reviews.length} reviews
                    </div>
                </div>

                <Horizontal />

                <div className="text-justify">
                    {product.description}
                </div>

                <Horizontal />

                <div>
                    <span className="font-semibold">CATEGORY: </span> {product.category}
                </div>
                <div>
                    <span className="font-semibold">BRAND: </span> {product.brand}
                </div>
                <div className={product.inStock ? 'text-teal-400' : 'text-rose-400'}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                </div>

                <Horizontal />

                {isProductInCart ?
                    <>
                        <div>
                            <p className="mb-2 text-slate-500 flex items-center gap-1">
                                <IoMdCheckmarkCircle className="text-teal-400" size={20} />
                                <span>Product added to cart</span>
                            </p>
                            <div className="max-w-[300px]">
                                <Button
                                    label="View Cart"
                                    outline
                                    onClick={() => {
                                        router.push('/cart')
                                    }}
                                />
                            </div>
                        </div>
                    </> : <>
                        <SetColor
                            cartProduct={cartProduct}
                            images={product.images}
                            handleColorSelect={handleColorSelect}
                        />
                        <Horizontal />
                        <SetQuantity
                            cartProduct={cartProduct}
                            handleQtyIncrease={handleQtyIncrease}
                            handleQtyDecrease={handleQtyDecrease}
                        />
                        <Horizontal />

                        <div className="max-w-[300px]">
                            <Button
                                label="Add To Cart"
                                onClick={() => handleAddProductToCart(cartProduct)}
                            />
                        </div>
                    </>}
            </div>
        </div>
    )
}

export default ProductDetails;