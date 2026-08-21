import BoxItems from "./box-items";
import FormArea from "./form-area";
import TopBar from "./top-bar";

const ContactArea = () => {
  return (
    <>
      <TopBar
        title="CONÓCENOS"
        subtitle="¿Tienes una consulta? Escribinos."
      />
      <BoxItems/>
      <FormArea/>
    </>
  );
};

export default ContactArea;
