import React, { useContext } from "react";
import { Sidebar, Menu, MenuItem, SubMenu, Icon } from "react-pro-sidebar";
import {
  FaSun,
  FaMoon,
  FaBars,
  FaCog,
  FaPlus,
  FaSignInAlt,
  FaHistory,
  FaSignOutAlt,
} from "react-icons/fa";
import { BiLogInCircle } from "react-icons/bi";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../stylesheets/sidebarv1.scss";
import { AuthContext } from "../contextApi/AuthContext";

const SidebarV1 = () => {
  const [toggled, setToggled] = React.useState(false);
  const [broken, setBroken] = React.useState(
    window.matchMedia("(max-width: 800px)").matches
  );
  const { authState, logout } = useContext(AuthContext);
  console.log(authState, ">>>>>>>>>auth state");

  const handleLogout = () => {
    logout();
  };

  return (
    <div
      style={{ display: "flex", height: "100%", minHeight: "400px" }}
      className="justify-content-small"
    >
      <Sidebar
        toggled={toggled}
        customBreakPoint="800px"
        onBreakPoint={setBroken}
        onBackdropClick={() => setToggled(false)}
        // backgroundColor="#171717"
      >
        <h6 className="mt-2 mb-4">Custom chat gpt</h6>
        <Menu>
          <MenuItem icon={<FaPlus />}> New Chat</MenuItem>

          <MenuItem icon={<FaMoon />}> theme</MenuItem>
          {!authState.isAuthenticated && (
            <MenuItem icon={<BiLogInCircle />}>
              <Link to="/signup" className="Link">
                Signup
              </Link>
            </MenuItem>
          )}
          <SubMenu icon={<FaHistory />} label="Recent">
            <MenuItem> Dark</MenuItem>
            <MenuItem> Light</MenuItem>
          </SubMenu>
          {authState.isAuthenticated ? (
            <MenuItem icon={<FaSignOutAlt />} onClick={handleLogout}>
              logout
            </MenuItem>
          ) : (
            <MenuItem icon={<FaSignInAlt />}>
              <Link to="/login" className="Link">
                login
              </Link>
            </MenuItem>
          )}
        </Menu>
      </Sidebar>
      <main style={{ padding: 10 }}>
        <div>
          {broken && !toggled && (
            <Button
              onClick={() => setToggled(!toggled)}
              className="btn btn-dark"
            >
              <FaBars />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};
export default SidebarV1;
