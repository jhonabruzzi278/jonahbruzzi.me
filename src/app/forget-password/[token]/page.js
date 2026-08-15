import ForgotPasswordArea from "@components/forget-password-area";


export const metadata = {
  title: "Restablecer contraseña",
};

const ForgotPassword = async ({ params, searchParams }) => {
  const {token} = await params;
  const {email} = await searchParams;
  return (
    <ForgotPasswordArea token={token} email={email} />
  );
};


export default ForgotPassword;
