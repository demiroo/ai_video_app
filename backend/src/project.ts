import {makeProject} from '@revideo/core';
import example from './scenes/example?scene';
import quiz_template from './scenes/quiz_template?scene'
import metadata from './metadata.json'
import "./global.css";



export default makeProject({
  scenes: [quiz_template],
  variables: metadata
});
