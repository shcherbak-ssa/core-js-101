/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const parsedJson = JSON.parse(json);
  // eslint-disable-next-line no-proto
  parsedJson.__proto__ = proto;
  return parsedJson;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
function throwNotMoreOneTimeExtantion() {
  throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
}

function throwOrderExtantion() {
  throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
}

class CssSelector {
  constructor(value, type) {
    this.elementValue = type === 'element';
    this.idValue = type === 'id';
    this.pseudoElementValue = type === 'pseudo-element';
    this.selector = [value];
    this.order = [type];
    this.correctOrder = ['element', 'id', 'class', 'attribute', 'pseudo-class', 'pseudo-element'];
  }

  element(value) {
    if (this.elementValue) {
      throwNotMoreOneTimeExtantion();
    }

    if (!this.isCorrectOrder('element')) {
      throwOrderExtantion();
    }

    this.elementValue = true;
    this.selector.push(value);

    return this;
  }

  id(value) {
    if (this.idValue) {
      throwNotMoreOneTimeExtantion();
    }

    if (!this.isCorrectOrder('id')) {
      throwOrderExtantion();
    }

    this.idValue = true;
    this.selector.push(`#${value}`);

    return this;
  }

  class(value) {
    if (!this.isCorrectOrder('class')) {
      throwOrderExtantion();
    }

    this.selector.push(`.${value}`);
    return this;
  }

  attr(value) {
    if (!this.isCorrectOrder('attribute')) {
      throwOrderExtantion();
    }

    this.selector.push(`[${value}]`);
    return this;
  }

  pseudoClass(value) {
    if (!this.isCorrectOrder('pseudo-class')) {
      throwOrderExtantion();
    }

    this.selector.push(`:${value}`);
    return this;
  }

  pseudoElement(value) {
    if (this.pseudoElementValue) {
      throwNotMoreOneTimeExtantion();
    }

    if (!this.isCorrectOrder('pseudo-element')) {
      throwOrderExtantion();
    }

    this.pseudoElementValue = true;
    this.selector.push(`::${value}`);

    return this;
  }

  stringify() {
    const selector = this.selector.join('');
    this.clearData();
    return selector;
  }

  clearData() {
    this.elementValue = false;
    this.idValue = false;
    this.pseudoElementValue = false;
    this.selector = [];
    this.order = [];
  }

  isCorrectOrder(type) {
    const lastType = this.order[this.order.length - 1];
    const lastCorrectTypeIndex = this.correctOrder.indexOf(lastType);
    const currentCorrectTypeIndex = this.correctOrder.indexOf(type);

    if (lastCorrectTypeIndex > currentCorrectTypeIndex) {
      return false;
    }

    this.order.push(type);
    return true;
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new CssSelector(value, 'element');
  },

  id(value) {
    return new CssSelector(`#${value}`, 'id');
  },

  class(value) {
    return new CssSelector(`.${value}`, 'class');
  },

  attr(value) {
    return new CssSelector(`[${value}]`, 'attribute');
  },

  pseudoClass(value) {
    return new CssSelector(`:${value}`, 'pseudo-class');
  },

  pseudoElement(value) {
    return new CssSelector(`::${value}`, 'pseudo-element');
  },

  combine(selector1, combinator, selector2) {
    return new CssSelector(`${selector1.stringify()} ${combinator} ${selector2.stringify()}`);
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
