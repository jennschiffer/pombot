import {execSync} from 'child_process';
import {createMatcher} from 'chatter';

export default createMatcher({
  match: 'version',
}, () => {
  const sha = execSync('git rev-parse HEAD').toString().trim();
  return `> The currently running SHA is *${sha}*.`;
});
