import { NorthernLightsBackground } from "@/components/ui/shadcn-io/northern-lights-background";
import TextType from './components/ui/titleText';
import { ChatInterface } from "./components/chat-interface";

export default function App() {
  return (
    <div className="relative min-h-screen bg-black">
      <NorthernLightsBackground
        className="fixed inset-0"
        colorStops={["#5227FF", "#7cff67", "#ff6b35"]}
        amplitude={2.2}
        blend={1.2}
        speed={0.5}
      />
      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen gap-20">
        <TextType
          text={["Triolla", "Creative Design Attracts People", "Smart UX Makes Them Stay."]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="|"
          className="scroll-m-20 text-center text-6xl font-extrabold tracking-tight text-balance"
          cursorClassName="text-white"
        />
      <ChatInterface />
      </div>
    </div>
  );
}
