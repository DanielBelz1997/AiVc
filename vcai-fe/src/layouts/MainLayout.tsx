import { NorthernLightsBackground } from "@/components/ui/shadcn-io/northern-lights-background";
import {
  NORTHERN_LIGHTS_AMPLITUDE,
  NORTHERN_LIGHTS_BLEND,
  NORTHERN_LIGHTS_COLOR_STOPS,
  NORTHERN_LIGHTS_SPEED,
} from "@/constants";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <div className="relative min-h-screen bg-black">
        <NorthernLightsBackground
          className="fixed inset-0 z-0"
          colorStops={NORTHERN_LIGHTS_COLOR_STOPS}
          amplitude={NORTHERN_LIGHTS_AMPLITUDE}
          blend={NORTHERN_LIGHTS_BLEND}
          speed={NORTHERN_LIGHTS_SPEED}
        />
        <div className="relative z-10">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default MainLayout;
