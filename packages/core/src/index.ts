export const parseMarkdown = (content: string) => {
  // TODO: implement markdown parsing
  return content;
};

export const renderMarkdown = (content: string) => {
  // TODO: implement markdown rendering
  return content;
};

export const stripAnnotations = (content: string) => {
  // TODO: implement annotation stripping
  return content.replace(/<!-- @cursor:[\s\S]*?-->/g, "");
};
