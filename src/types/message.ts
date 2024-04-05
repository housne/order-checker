import {
  MessageBarIntent
} from "@fluentui/react-components";

export type Message = {
  type: MessageBarIntent
  content: string
}