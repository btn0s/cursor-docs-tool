// src/index.ts
var parseMarkdown = (content) => {
  return content;
};
var renderMarkdown = (content) => {
  return content;
};
var stripAnnotations = (content) => {
  return content.replace(/<!-- @cursor:[\s\S]*?-->/g, "");
};
export {
  parseMarkdown,
  renderMarkdown,
  stripAnnotations
};
