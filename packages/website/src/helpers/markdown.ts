export interface IContentList {
  [key: string]: string[];
}

export const exportListFromMarkdown = (markdown: string) => {
  const lines = markdown.split('\n');
  const titles = lines.filter((line) => line.startsWith('##'));
  const list: IContentList = {};
  let key = '';
  for (let i = 0; i < titles.length; i++) {
    const title = titles[i];
    if (title.startsWith('## ')) {
      key = title.substring(3);
      if (!list[key]) {
        list[key] = [];
      }
    }
    if (title.startsWith('### ')) {
      const child = title.substring(4);
      list[key].push(child);
    }
  }
  return list;
};
