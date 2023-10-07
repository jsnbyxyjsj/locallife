import { useAppContext } from "../libs/contextLib";
// === Components ===
import Profile from "./Profile";

function MenuBar() {
  const { navBarOpened } = useAppContext();
  return (
    <div
      className={
        "MenuBar " +
        (navBarOpened ? "MenuBar__navBarOpen" : "MenuBar__navBarClose")
      }
    >
      <label>COOLDATA - © 2023 </label>
      <Profile></Profile>
    </div>
  );
}

export default MenuBar;
