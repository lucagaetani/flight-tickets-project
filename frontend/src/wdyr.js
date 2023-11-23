/** 
 * What is this?
 * 
 * It's "Why Did You Render", a library that gives you help to
 * delete some unnecessary renders, to generally improve React
 * performance.
 * It's active only when in development mode, because it's
 * slows down React itself.
 * 
**/
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import whyDidYouRender from '@welldone-software/why-did-you-render';

if (import.meta.env.DEV) {
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackExtraHooks: [[ReactRedux, 'useSelector']],
  });
}