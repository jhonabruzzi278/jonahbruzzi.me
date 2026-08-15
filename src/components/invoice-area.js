"use client";
import Image from "next/image";
import dayjs from "dayjs";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
// internal
import { formatPrice } from "@config/site";

export default function InvoiceArea({innerRef,info}) {
    const {
      id,
      customerName,
      country,
      city,
      phone,
      createdAt,
      items,
      paymentMethod,
      shippingCost,
      discount,
      total,
    } = info || {};
  return (
    <div ref={innerRef} className="invoice__wrapper grey-bg-15 pt-40 pb-40 pl-40 pr-40 tp-invoice-print-wrapper">
      {/* <!-- invoice header --> */}
      <div className="invoice__header-wrapper border-2 border-bottom border-white mb-40">
        <div className="row">
          <div className="col-xl-12">
            <div className="invoice__header pb-20">
              <div className="row align-items-end">
                <div className="col-md-4 col-sm-6">
                  <div className="invoice__left">
                    <Image className="mb-15" priority src="/assets/img/logo/jonahbruzzi-mark.svg" alt="logo" width={42} height={42} />
                  </div>
                </div>
                <div className="col-md-8 col-sm-6">
                  <div className="invoice__right mt-15 mt-sm-0 text-sm-end">
                    <h3 className="text-uppercase font-70 mb-20">Factura</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- invoice customer details --> */}
      <div className="invoice__customer mb-30">
        <div className="row">
          <div className="col-md-6 col-sm-8">
            <div className="invoice__customer-details">
              <h4 className="mb-10 text-uppercase">{customerName}</h4>
              <p className="mb-0 text-uppercase">{country}</p>
              <p className="mb-0 text-uppercase">{city}</p>
              <p className="mb-0">{phone}</p>
            </div>
          </div>
          <div className="col-md-6 col-sm-4">
            <div className="invoice__details mt-md-0 mt-20 text-md-end">
              <p className="mb-0">
                <strong>N.º de factura:</strong> #{id}
              </p>
              <p className="mb-0">
                <strong>Fecha:</strong> {dayjs(createdAt).format("D [de] MMMM [de] YYYY")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- invoice order table --> */}
      <div className="invoice__order-table pt-30 pb-30 pl-40 pr-40 bg-white  mb-30">
        <Table className="table">
          <Thead className="table-light">
            <Tr>
              <Th scope="col">N.º</Th>
              <Th scope="col">Producto</Th>
              <Th scope="col">Cantidad</Th>
              <Th scope="col">Precio unitario</Th>
              <Th scope="col">Total</Th>
            </Tr>
          </Thead>
          <Tbody className="table-group-divider">
            {items?.map((item, i) => (
              <Tr key={i}>
                <Td>{i + 1}</Td>
                <Td>{item.title}</Td>
                <Td>{item.orderQuantity}</Td>
                <Td>{formatPrice(item.price)}</Td>
                <Td>{formatPrice(item.price * item.orderQuantity)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>

      {/* <!-- invoice total --> */}
      <div className="invoice__total pt-40 pb-10 alert-success pl-40 pr-40 mb-30">
        <div className="row">
          <div className="col-lg-3 col-md-4">
            <div className="invoice__payment-method mb-30">
              <h5 className="mb-0">Método de pago</h5>
              <p className="tp-font-medium text-uppercase">{paymentMethod}</p>
            </div>
          </div>
          <div className="col-lg-3 col-md-4">
            <div className="invoice__shippint-cost mb-30">
              <h5 className="mb-0">Costo de envío</h5>
              <p className="tp-font-medium">{formatPrice(shippingCost)}</p>
            </div>
          </div>
          <div className="col-lg-3 col-md-4">
            <div className="invoice__discount-cost mb-30">
              <h5 className="mb-0">Descuento</h5>
              <p className="tp-font-medium">{formatPrice(discount)}</p>
            </div>
          </div>
          <div className="col-lg-3 col-md-4">
            <div className="invoice__total-ammount mb-30">
              <h5 className="mb-0">Monto total</h5>
              <p className="tp-font-medium text-danger">
                <strong>{formatPrice(total)}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
