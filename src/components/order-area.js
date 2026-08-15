"use client";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
// internal
import Loader from "@components/loader/loader";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import Footer from "@layout/footer";
import { useGetMyOrderByIdQuery } from "src/redux/features/order/wooOrderApi";
import ErrorMessage from "@components/error-message/error";
import InvoiceArea from "./invoice-area";

const SingleOrderArea = ({ orderId }) => {
  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({ contentRef });
  const { data: order, isError, isLoading } = useGetMyOrderByIdQuery(orderId);
  let content = null;
  if (isLoading) {
    content = (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: "100vh" }}
      >
        <Loader loading={isLoading} />
      </div>
    );
  }
  if (isError) {
    content = <ErrorMessage message="Ocurrió un error" />;
  }
  if (!isLoading && !isError) {
    content = (
      <section className="invoice__area pt-120 pb-120">
        <div className="container">
          {/* <!-- invoice msg --> */}
          <div className="invoice__msg-wrapper">
            <div className="row">
              <div className="col-xl-12">
                <div className="invoice_msg mb-40">
                  <p className="text-black alert alert-success">
                    Gracias <strong>{order.customerName}</strong>, hemos recibido tu pedido.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* invoice area start */}
          <InvoiceArea innerRef={contentRef} info={order} />
          {/* invoice area end */}

          {/* invoice print  */}
          <div className="invoice__print text-end mt-10">
            <div className="row">
              <div className="col-xl-12">
                <button
                  onClick={handlePrint}
                  type="button"
                  className="tp-invoice-print tp-btn tp-btn-black"
                >
                  <span className="mr-5">
                    <i className="fa-regular fa-print"></i>
                  </span>{" "}
                  Imprimir
                </button>
              </div>
            </div>
            {/* invoice print */}
          </div>
        </div>
      </section>
    );
  }
  return (
    <>
      <Wrapper>
        <Header style_2={true} />
        {/* content */}
        {content}
        {/* content */}
        {/* footer start */}
        <Footer />
        {/* footer end */}
      </Wrapper>
    </>
  );
};

export default SingleOrderArea;
