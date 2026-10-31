import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { SUGGESTIONS_PREFIX } from "@/config/assistant";

const INLINE_PATTERN = /\*\*(.+?)\*\*|\[([^\]]+)\]\((\/[^)\s]*)\)/g;
const LIST_ITEM_PATTERN = /^\s*[-*•]\s+/;

const renderInline = (text: string, onNavigate?: () => void, keyPrefix = ""): ReactNode[] => {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(INLINE_PATTERN)) {
    const index = match.index ?? 0;
    const key = `${keyPrefix}${index}`;
    nodes.push(text.slice(lastIndex, index));
    nodes.push(
      match[1] !== undefined ? (
        <strong key={key} className="font-semibold">
          {renderInline(match[1], onNavigate, `${key}-`)}
        </strong>
      ) : (
        <Link key={key} href={match[3]} onClick={onNavigate} className="font-medium text-accent hover:underline">
          {match[2]}
        </Link>
      )
    );
    lastIndex = index + match[0].length;
  }

  nodes.push(text.slice(lastIndex));
  return nodes;
};

const PARTIAL_LINK = /\[([^\]]*)(\]\([^)]*)?$/;

export const stripSuggestions = (text: string) => {
  const index = text.indexOf(SUGGESTIONS_PREFIX);
  return (index === -1 ? text : text.slice(0, index)).trim();
};

const hidePartialLink = (text: string) => text.replace(PARTIAL_LINK, "$1");

type AssistantReplyProps = {
  text: string;
  onNavigate?: () => void;
};

export default function AssistantReply({ text, onNavigate }: AssistantReplyProps) {
  const blocks = hidePartialLink(stripSuggestions(text)).split(/\n{2,}/).filter(Boolean);

  return (
    <div className="flex flex-col gap-2">
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n").filter(Boolean);
        const isList = lines.every((line) => LIST_ITEM_PATTERN.test(line));

        return isList ? (
          <ul key={blockIndex} className="flex list-disc flex-col gap-1 pl-5">
            {lines.map((line, lineIndex) => (
              <li key={lineIndex}>{renderInline(line.replace(LIST_ITEM_PATTERN, ""), onNavigate)}</li>
            ))}
          </ul>
        ) : (
          <p key={blockIndex}>
            {lines.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {lineIndex > 0 && <br />}
                {renderInline(line, onNavigate)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
