// components/ProductCard.tsx
'use client';

import Image from "next/image";
import { truncateText } from "../../utils/truncateText";
import { formatPrice } from "../../utils/formatPrice";
import { Rating } from "@mui/material";
import { useRouter } from "next/navigation";

interface ProductCardProps {
    data: any
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {

    const router = useRouter();

    // getting the average reviews for our rating
    const productRating =
        data.reviews.reduce((acc: number, item: any) =>
            item.rating + acc, 0) /
        data.reviews.length;


    return (
        <div className='col-span-1 cursor-pointer border-slate-200 border-[1.2px] bg-slate-50 rounded-sm p-2 transition hover:scale-105 text-center text-sm'
            onClick={() => router.push(`/product/${data.id}`)}>
            <div className='flex flex-col items-center w-full gap-1'>
                <div className="aspect-square overflow-hidden relative w-full">
                    <Image
                        fill
                        src={data.images[0].image}
                        alt={data.name}
                        className="w-full h-full object-contain" />
                </div>
                <div className="mt-4">{truncateText(data.name)}</div>
                <div><Rating value={productRating} readOnly /></div>
                <div>{data.reviews.length} reviews</div>
                <div className="font-semibold">{formatPrice(data.price)}</div>
            </div>
        </div>
    );
};

export default ProductCard;

