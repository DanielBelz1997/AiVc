import TextType from "@/components/ui/titleText";
import { ChatInterface } from "@/components/chat-interface";
import {
  CHANGING_TITLE,
  CHAT_INPUT_TEXT,
  TITLE_CURSOR_CHARACTER,
  TITLE_PAUSE_DURATION,
  TITLE_TYPING_SPEED,
} from "@/constants";

export const HeroMain = () => {
  return (
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
  );
};
