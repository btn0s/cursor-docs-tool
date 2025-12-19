import { Command } from 'commander';
import { stripAnnotations } from 'core';

const program = new Command();

program
  .name('cursor-docs')
  .description('CLI for repo-native Cursor doc review tool')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize the documentation system in the current repo')
  .action(() => {
    console.log('Initializing cursor-docs...');
  });

program
  .command('publish')
  .description('Publish a markdown file for review')
  .argument('<file>', 'markdown file to publish')
  .action((file) => {
    console.log(`Publishing ${file}...`);
    // Example usage of core
    // const content = fs.readFileSync(file, 'utf-8');
    // const stripped = stripAnnotations(content);
  });

program
  .command('pull')
  .description('Pull review feedback from GitHub')
  .argument('<file>', 'markdown file to pull feedback for')
  .action((file) => {
    console.log(`Pulling feedback for ${file}...`);
  });

program.parse();
