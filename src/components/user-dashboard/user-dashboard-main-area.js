"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
// internal
import Header from "@layout/header";
import Wrapper from "@layout/wrapper";
import Footer from "@layout/footer";
import { useGetMyOrdersQuery } from "src/redux/features/order/wooOrderApi";
import DashboardArea from "@components/user-dashboard/dashboard-area";
import Loader from "@components/loader/loader";
import ErrorMessage from "@components/error-message/error";

const UserDashboardMainArea = () => {
  const { data: orderData, isError, isLoading } = useGetMyOrdersQuery();
  const router = useRouter();

  useEffect(() => {
    const isAuthenticate = localStorage.getItem("auth");
    if (!isAuthenticate) {
      router.push("/login");
    }
  }, [router]);

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
  if (orderData && !isError) {
    content = <DashboardArea orderData={orderData} />;
  }

  return (
    <Wrapper>
      <Header style_2={true} />
      {content}
      <Footer />
    </Wrapper>
  );
};

export default UserDashboardMainArea;
