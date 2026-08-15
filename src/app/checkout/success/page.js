import Link from "next/link";
// internal
import Header from "@layout/header";
import Footer from "@layout/footer";
import Wrapper from "@layout/wrapper";

export const metadata = {
  title: "Pedido confirmado",
};

// Mercado Pago's WooCommerce plugin redirects here with its own query
// params (external_reference, payment_id, collection_status, ...) — it does
// NOT forward WooCommerce's order_key, so there's no way to verify the
// visitor owns this order. Only the order number (safe, not sensitive on
// its own) is shown here; never fetch/display address or line items on an
// unverified return page.
function extractOrderNumber(sp) {
  const ref = sp.external_reference;
  if (!ref) return null;
  const match = /^WC-(\d+)$/.exec(ref);
  return match ? match[1] : null;
}

export default async function CheckoutSuccessPage({ searchParams }) {
  const sp = await searchParams;
  const orderNumber = extractOrderNumber(sp);

  return (
    <Wrapper>
      <Header style_2={true} />
      <section className="pt-120 pb-120">
        <div className="container text-center">
          <h2 className="mb-20">¡Gracias por tu compra!</h2>
          <p>
            {orderNumber
              ? `Tu pedido #${orderNumber} fue recibido correctamente y está siendo procesado.`
              : "Tu pago se realizó correctamente."}
          </p>
          <p>Revisa tu correo electrónico para la confirmación de tu pedido.</p>
          <Link href="/shop" className="tp-btn mt-30">
            Seguir comprando
          </Link>
        </div>
      </section>
      <Footer />
    </Wrapper>
  );
}
