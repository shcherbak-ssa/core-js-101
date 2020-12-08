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

class CssSelector {
  constructor(value, type) {
    this._element = type === 'element';
    this._id = type === 'id';
    this._pseudoElement = type === 'pseudo-element';
    this._selector = [value];
    this._order = [type];
    this._correctOrder = ['element', 'id', 'class', 'attribute', 'pseudo-class', 'pseudo-element'];
  }

  element(value) {
    if (this._element) {
      this._throwNotMoreOneTimeExtantion();
    }

    if (!this._isCorrectOrder('element')) {
      this._throwOrderExtantion();
    }

    this._element = true;
    this._selector.push(value);

    return this;
  }

  id(value) {
    if (this._id) {
      this._throwNotMoreOneTimeExtantion();
    }

    if (!this._isCorrectOrder('id')) {
      this._throwOrderExtantion();
    }

    this._id = true;
    this._selector.push('#' + value);

    return this;
  }

  class(value) {
    if (!this._isCorrectOrder('class')) {
      this._throwOrderExtantion();
    }

    this._selector.push('.' + value);
    return this;
  }

  attr(value) {
    if (!this._isCorrectOrder('attribute')) {
      this._throwOrderExtantion();
    }

    this._selector.push(`[${value}]`);
    return this;
  }

  pseudoClass(value) {
    if (!this._isCorrectOrder('pseudo-class')) {
      this._throwOrderExtantion();
    }

    this._selector.push(':' + value);
    return this;
  }

  pseudoElement(value) {
    if (this._pseudoElement) {
      this._throwNotMoreOneTimeExtantion();
    }

    if (!this._isCorrectOrder('pseudo-element')) {
      this._throwOrderExtantion();
    }

    this._pseudoElement = true;
    this._selector.push('::' + value);

    return this;
  }

  stringify() {
    const selector = this._selector.join('');
    this._clearData();
    return selector;
  }

  _clearData() {
    this._element = false;
    this._id = false;
    this._pseudoElement = false;
    this._selector = [];
    this._order = [];
  }

  _isCorrectOrder(type) {
    const lastType = this._order[this._order.length - 1];
    const lastCorrectTypeIndex = this._correctOrder.indexOf(lastType);
    const currentCorrectTypeIndex = this._correctOrder.indexOf(type);

    if (lastCorrectTypeIndex > currentCorrectTypeIndex) {
      return false;
    }

    this._order.push(type);
    return true;
  }

  _throwNotMoreOneTimeExtantion() {
    throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
  }

  _throwOrderExtantion() {
    throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new CssSelector(value, 'element');
  },

  id(value) {
    return new CssSelector('#' + value, 'id');
  },

  class(value) {
    return new CssSelector('.' + value, 'class');
  },

  attr(value) {
    return new CssSelector(`[${value}]`, 'attribute');
  },

  pseudoClass(value) {
    return new CssSelector(':' + value, 'pseudo-class');
  },

  pseudoElement(value) {
    return new CssSelector('::' + value, 'pseudo-element');
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
