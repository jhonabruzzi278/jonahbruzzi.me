import Link from "next/link";
// internal
import Header from "@layout/header";
import Footer from "@layout/footer";
import Wrapper from "@layout/wrapper";

export const metadata = {
  title: "Pago no procesado",
};

export default function CheckoutFailurePage() {
  return (
    <Wrapper>
      <Header style_2={true} />
      <section className="pt-120 pb-120">
        <div className="container text-center">
          <h2 className="mb-20">Tu pago no pudo procesarse</h2>
          <p>
            Ocurrió un problema al procesar el pago con Mercado Pago. No se
            realizó ningún cobro. Puedes volver al carro e intentar
            nuevamente.
          </p>
          <Link href="/cart" className="tp-btn mt-30">
            Volver al carro
          </Link>
        </div>
      </section>
      <Footer />
    </Wrapper>
  );
}
