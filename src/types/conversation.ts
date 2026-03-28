import type { Message } from "./message";
import type { Participant } from "./participants";

export type Conversation = {
  id: string;
  name?: string | null;
  display_name? : string | null
  is_group: boolean;
  participants: Participant[];
  messages: Message[];
  last_message? : string;
  updated_at : string;
};
