import React, { useEffect, useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import Pagination from "@ui/Pagination";

// WooCommerce order statuses map onto the pending/hold/done status pill
// styles the UI already has — anything else (cancelled/refunded/failed)
// falls through with no extra class.
function statusClass(status) {
  if (status === "pending") return "pending";
  if (status === "processing" || status === "on-hold") return "hold";
  if (status === "completed") return "done";
  return "";
}

const MyOrderItems = ({ items, itemsPerPage }) => {
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  // side effect
  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(items?.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, items]);

  // handlePageClick
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };
  return (
    <React.Fragment>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">N.º de pedido</th>
            <th scope="col">Fecha del pedido</th>
            <th scope="col">Estado</th>
            <th scope="col">Ver</th>
          </tr>
        </thead>
        <tbody>
          {currentItems &&
            currentItems.map((item) => (
              <tr key={item.id}>
                <th className="text-uppercase" scope="row">
                  #{item.id}
                </th>
                <td data-info="title">
                  {dayjs(item?.createdAt).format("D [de] MMMM [de] YYYY")}
                </td>
                <td
                  data-info={`status ${statusClass(item?.status)}`}
                  className={`status ${statusClass(item?.status)}`}
                >
                  {item?.status}
                </td>
                <td>
                  <Link href={`/order/${item.id}`} className="tp-btn">
                    Factura
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {/* pagination start */}
      {items.length > itemsPerPage && (
        <div className="mt-20 ml-20 tp-pagination tp-pagination-style-2">
          <Pagination handlePageClick={handlePageClick} pageCount={pageCount} />
        </div>
      )}
      {/* pagination end */}
    </React.Fragment>
  );
};

export default MyOrderItems;
