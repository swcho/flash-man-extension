export type FlashCardItem = {
  lineNo: number;
  q: string;
  a: string;
};

export function getFlashCardItems(content?: string): FlashCardItem[] {
  if (content) {
    const lines = content.split("\n");
    const flashCardItems = lines
      .map<FlashCardItem>((l, id) => {
        const [q, a] = l.replace(/\t+/, "\t").split("\t");
        return { lineNo: id, q, a: a?.replace(/^\| /, "") };
      })
      .filter(({ q, a }) => Boolean(q) && Boolean(a));
    return flashCardItems;
  }
  return [];
}
