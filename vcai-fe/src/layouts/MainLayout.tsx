import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex flex-col h-full">
      {/* <AppBar /> */}
      <Outlet />
      {/* <BackgroundGlow /> */}
    </div>
  );
};

export default MainLayout;
