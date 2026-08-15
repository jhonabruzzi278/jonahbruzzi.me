import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";
import { userLoggedOut } from "src/redux/features/auth/authSlice";

const ProfileNav = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  // handle logout
  const handleLogout = () => {
    dispatch(userLoggedOut());
    router.push('/login')
  }
  return (
    <div className="profile__tab mr-40">
      <nav>
        <div
          className="nav nav-tabs tp-tab-menu flex-column"
          id="profile-tab"
          role="tablist"
        >
          <button
            className="nav-link active"
            id="nav-profile-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-profile"
            type="button"
            role="tab"
            aria-controls="nav-profile"
            aria-selected="false"
          >
            <span>
              <i className="fa-regular fa-user-pen"></i>
            </span>
            Perfil
          </button>

          <button
            className="nav-link"
            id="nav-order-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-order"
            type="button"
            role="tab"
            aria-controls="nav-order"
            aria-selected="false"
          >
            <span>
              <i className="fa-light fa-clipboard-list-check"></i>
            </span>
            Mis pedidos
          </button>

          <button
            className="nav-link"
            id="nav-information-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-information"
            type="button"
            role="tab"
            aria-controls="nav-information"
            aria-selected="false"
          >
            <span>
              <i className="fa-regular fa-circle-info"></i>
            </span>{" "}
            Información
          </button>

          <button
            className="nav-link"
            id="nav-password-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-password"
            type="button"
            role="tab"
            aria-controls="nav-password"
            aria-selected="false"
          >
            <span>
              <i className="fa-regular fa-lock"></i>
            </span>{" "}
            Cambiar contraseña
          </button>

          <button onClick={handleLogout} className="nav-link" type="button">
            <span>
              <i className="fa-light fa-arrow-right-from-bracket"></i>
            </span>
            Cerrar sesión
          </button>
          <span
            id="marker-vertical"
            className="tp-tab-line d-none d-sm-inline-block"
          ></span>
        </div>
      </nav>
    </div>
  );
};

export default ProfileNav;
