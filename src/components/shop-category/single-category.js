import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const SingleCategory = ({ item }) => {
  const router = useRouter();
  return (
    <div className="product__category-item mb-20 text-center">
      <div className="product__category-thumb w-img">
        <a
          onClick={() => router.push(`/shop?category=${item.slug}`)}
          style={{ cursor: "pointer" }}
        >
          {item.img ? (
            <Image
              src={item.img}
              alt="image"
              width={272}
              height={181}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                aspectRatio: "272 / 181",
                background: "var(--jb-background)",
              }}
            />
          )}
        </a>
      </div>
      <div className="product__category-content">
        <h3 className="product__category-title">
          <a
            onClick={() => router.push(`/shop?category=${item.slug}`)}
            style={{ cursor: "pointer" }}
          >
            {item.parent}
          </a>
        </h3>
      </div>
    </div>
  );
};

export default SingleCategory;
