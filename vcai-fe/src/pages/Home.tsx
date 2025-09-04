import TextType from "@/components/ui/titleText";
import { ChatInterface } from "@/components/chat-interface";
import { NorthernLightsBackground } from "@/components/ui/shadcn-io/northern-lights-background";
import {
  CHANGING_TITLE,
  CHAT_INPUT_TEXT,
  NORTHERN_LIGHTS_AMPLITUDE,
  NORTHERN_LIGHTS_BLEND,
  NORTHERN_LIGHTS_COLOR_STOPS,
  NORTHERN_LIGHTS_SPEED,
  TITLE_CURSOR_CHARACTER,
  TITLE_PAUSE_DURATION,
  TITLE_TYPING_SPEED,
} from "@/constants";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-black">
      <NorthernLightsBackground
        className="fixed inset-0"
        colorStops={NORTHERN_LIGHTS_COLOR_STOPS}
        amplitude={NORTHERN_LIGHTS_AMPLITUDE}
        blend={NORTHERN_LIGHTS_BLEND}
        speed={NORTHERN_LIGHTS_SPEED}
      />
      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen gap-20">
        <TextType
          text={CHANGING_TITLE}
          typingSpeed={TITLE_TYPING_SPEED}
          pauseDuration={TITLE_PAUSE_DURATION}
          showCursor={true}
          cursorCharacter={TITLE_CURSOR_CHARACTER}
          className="scroll-m-20 text-center text-6xl font-extrabold tracking-tight text-balance"
          cursorClassName="text-white"
        />
        <ChatInterface inputText={CHAT_INPUT_TEXT} />
      </div>
    </div>
  );
}
