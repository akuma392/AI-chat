import React, { useState, useContext } from "react";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  menuClasses,
} from "react-pro-sidebar";
import { FaHistory, FaPlus, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { BiLogInCircle } from "react-icons/bi";

import Switch from "./elements/Switch";
import { SidebarHeader } from "./elements/SidebarHeader";
import { Global } from "./icons/Global.tsx";
import { InkBottle } from "./icons/InkBottle.tsx";
import SidebarFooter from "./elements/SidebarFooter";
import Badge from "./elements/Badge";
import Typography from "./elements/Typhography";
import { themes, hexToRgba } from "./utils/utils.js";
import { AuthContext } from "../contextApi/AuthContext.js";

const Playground = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [broken, setBroken] = useState(false);
  const [rtl, setRtl] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [theme, setTheme] = useState("light");

  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  const handleRTLChange = (e) => {
    setRtl(e.target.checked);
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.checked ? "dark" : "light");
  };

  const menuItemStyles = {
    root: {
      fontSize: "13px",
      fontWeight: 400,
    },
    icon: {
      color: themes[theme].menu.icon,
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
    },
    SubMenuExpandIcon: {
      color: "#b6b7b9",
    },
    subMenuContent: ({ level }) => ({
      backgroundColor:
        level === 0
          ? hexToRgba(
              themes[theme].menu.menuContent,
              hasImage && !collapsed ? 0.4 : 1
            )
          : "transparent",
    }),
    button: {
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
      "&:hover": {
        backgroundColor: hexToRgba(
          themes[theme].menu.hover.backgroundColor,
          hasImage ? 0.8 : 1
        ),
        color: themes[theme].menu.hover.color,
      },
    },
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
    }),
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        direction: rtl ? "rtl" : "ltr",
      }}
    >
      <Sidebar
        collapsed={collapsed}
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        onBreakPoint={setBroken}
        rtl={rtl}
        breakPoint="md"
        backgroundColor={hexToRgba(
          themes[theme].sidebar.backgroundColor,
          hasImage ? 0.9 : 1
        )}
        rootStyles={{
          color: themes[theme].sidebar.color,
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <SidebarHeader
            rtl={rtl}
            style={{ marginBottom: "24px", marginTop: "16px" }}
          />
          <div style={{ flex: 1, marginBottom: "32px" }}>
            <div style={{ padding: "0 24px", marginBottom: "8px" }}>
              <Typography
                variant="body2"
                fontWeight={600}
                style={{ opacity: collapsed ? 0 : 0.7, letterSpacing: "0.5px" }}
              >
                General
              </Typography>
            </div>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem icon={<FaPlus />}>New Chat</MenuItem>
              <SubMenu label="Theme" icon={<InkBottle />}>
                <MenuItem> Dark</MenuItem>
                <MenuItem> Light</MenuItem>
              </SubMenu>
              <SubMenu label="Recent" icon={<FaHistory />}>
                <MenuItem> Grid</MenuItem>
                <MenuItem> Layout</MenuItem>
              </SubMenu>
              {!authState.isAuthenticated ? (
                <>
                  <MenuItem
                    icon={<BiLogInCircle />}
                    onClick={() => navigate("/signup")}
                  >
                    Signup
                  </MenuItem>
                  <MenuItem
                    icon={<FaSignInAlt />}
                    onClick={() => navigate("/login")}
                  >
                    login
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem icon={<CgProfile />}>Profile</MenuItem>
                  <MenuItem icon={<FaSignOutAlt />}>logout</MenuItem>
                </>
              )}
            </Menu>

            <div
              style={{
                padding: "0 24px",
                marginBottom: "8px",
                marginTop: "32px",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                style={{ opacity: collapsed ? 0 : 0.7, letterSpacing: "0.5px" }}
              >
                Extra
              </Typography>
            </div>

            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                icon={<Global />}
                suffix={<Badge variant="success">New</Badge>}
              >
                Documentation
              </MenuItem>
            </Menu>
          </div>
          <SidebarFooter collapsed={collapsed} />
        </div>
      </Sidebar>

      <main
        style={{
          width: "100vw", // Full width of the viewport
          maxWidth: "100%", // Prevent any overflow issues
          padding: "0", // Remove default padding
          boxSizing: "border-box", // Ensure padding/border are included in width
        }}
      >
        <div style={{ padding: "16px 24px", color: "#44596e" }}>
          <div style={{ marginBottom: "16px" }}>
            {broken && (
              <button
                className="sb-button"
                onClick={() => setToggled(!toggled)}
              >
                Toggle
              </button>
            )}
          </div>
          <div style={{ marginBottom: "48px" }}>
            <Typography variant="h4" fontWeight={600}>
              React Pro Sidebar
            </Typography>
            <Typography variant="body2">
              React Pro Sidebar provides a set of components for creating high
              level and customizable side navigation
            </Typography>
            {/* <PackageBadges /> */}
          </div>

          <div style={{ padding: "0 8px" }}>
            <div style={{ marginBottom: 16 }}>
              <Switch
                id="collapse"
                checked={collapsed}
                onChange={() => setCollapsed(!collapsed)}
                label="Collapse"
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <Switch
                id="rtl"
                checked={rtl}
                onChange={handleRTLChange}
                label="RTL"
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <Switch
                id="theme"
                checked={theme === "dark"}
                onChange={handleThemeChange}
                label="Dark theme"
              />
            </div>
          </div>
        </div>
        <>{children}</>
      </main>
    </div>
  );
};

export default Playground;
