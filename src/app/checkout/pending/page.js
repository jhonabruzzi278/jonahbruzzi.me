import Link from "next/link";
// internal
import Header from "@layout/header";
import Footer from "@layout/footer";
import Wrapper from "@layout/wrapper";

export const metadata = {
  title: "Pago pendiente",
};

export default function CheckoutPendingPage() {
  return (
    <Wrapper>
      <Header style_2={true} />
      <section className="pt-120 pb-120">
        <div className="container text-center">
          <h2 className="mb-20">Tu pago está pendiente</h2>
          <p>
            Mercado Pago todavía está procesando tu pago (por ejemplo, si
            elegiste un medio de pago que se confirma más tarde, como
            transferencia). Te avisaremos por correo cuando se confirme.
          </p>
          <Link href="/shop" className="tp-btn mt-30">
            Seguir comprando
          </Link>
        </div>
      </section>
      <Footer />
    </Wrapper>
  );
}
