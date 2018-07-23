// Wraps 'what' with 'wrapper.begin' and 'wrapper.end' and returns updated html
export function htmlWrapper(html, what, wrapper, flags  = 'g') {
  try {
    const regExp = new RegExp(what, flags);
    const wrappedHtml = html.replace(regExp, (wrapper.before || '') + what + (wrapper.after || ''));
    return wrappedHtml;
  }
  catch (err) {
  }
  return html;
}

// Sets aria label ('how') for html fragment ('how:what') or array of tags
export function addLabel(html, how = { what: '', label: '', role: '', flags: '' }) {
  try {
    const labels = Array.isArray(how) ? how.slice() : [how];
    let updatedHtml = html;
    labels.forEach(elem => {
      const role = elem.role || 'document';
      const label = elem.label || '';
      const wrapper = { before: `<span role="${role}" aria-label="${label}">`, after: '</span>' };
      updatedHtml = htmlWrapper(updatedHtml, elem.what, wrapper, elem.flags);
    });
    return updatedHtml;
  }
  catch (err) {
  }
  return html;
}

// Adds aria attribute for class(es)
export function addClassAttribute(html, how = { class: '', attr: '', value: '', flags: '' }) {
  try {
    const classes = Array.isArray(how) ? how.slice() : [how];
    let updatedHtml = html;
    classes.forEach(elem => {
      const wrapper = { before: '', after: ` ${elem.attr}="${elem.value}" `};
      updatedHtml = htmlWrapper(updatedHtml, `class="${elem.class}"`, wrapper, elem.flags || 'g');
    });
    return updatedHtml;
  }
  catch (err) {
  }
  return html;
}

// Adds aria's attribute 'attrText' for class 'className' or array of classes
// @param html source html
// @param className single class name or array of class names as strings
// @param attrText html attribute as string
// @return updated html or source html in case of error
export function addClassAttributeAsText(html, className, attrText) {
  try {
    const classes = Array.isArray(className) ? className.slice() : [className];
    let updatedHtml = html;
    classes.forEach(elem => {
      const wrapper = { before: '', after: ' ' + attrText };
      updatedHtml = htmlWrapper(updatedHtml, `class="${elem}"`, wrapper);
    });
    return updatedHtml;
  }
  catch (err) {
  }
  return html;
}

// functions
export const publicUtils = {
  htmlWrapper, addLabel, addClassAttribute, addClassAttributeAsText
};

export default publicUtils;
