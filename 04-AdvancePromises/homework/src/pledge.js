'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:

function $Promise(executor) {
  this._state = 'pending';
  this._value = undefined;
  this._handlerGroups = [];
  if (typeof executor !== 'function') throw new TypeError('executor must be a function');

  // executor -> primer argumento con arrow func, segundo argumento binding this
  executor((value) => this._internalResolve(value), this._internalReject.bind(this));
}

$Promise.prototype._internalResolve = function (value) {
  if (this._state === 'pending') {
    this._state = 'fulfilled';
    this._value = value;
    this._callHandlers();
  }
}

$Promise.prototype._internalReject = function (value) {
  if (this._state === 'pending') {
    this._state = 'rejected';
    this._value = value;
    this._callHandlers();
  }
};

$Promise.prototype._callHandlers = function () {
  if (this._state !== 'pending') {
    while (this._handlerGroups.length) {
      const { successCb, errorCb, downstreamPromise } = this._handlerGroups.shift();
      if (this._state === 'fulfilled') {
        if (successCb) {
          try {
            const result = successCb(this._value);
            if (result instanceof $Promise) {
              result.then(
                (value) => downstreamPromise._internalResolve(value),
                (error) => downstreamPromise._internalReject(error)
              )
            } else {
              downstreamPromise._internalResolve(result)
            }
          } catch (e) {
            downstreamPromise._internalReject(e)
          }
        }
        else {
          downstreamPromise._internalResolve(this._value)
        }
      }
      if (this._state === 'rejected') {
        if (errorCb) {
          try {
            const result = errorCb(this._value);
            if (result instanceof $Promise) {
              result.then(
                (value) => downstreamPromise._internalResolve(value),
                (error) => downstreamPromise._internalReject(error)
              )
            } else {
              downstreamPromise._internalResolve(result)
            }
          } catch (e) {
            downstreamPromise._internalReject(e)
          }
        }
        else {
          downstreamPromise._internalReject(this._value);
        }
      }
    }
  }
};


$Promise.prototype.then = function (successCb, errorCb) {
  const downstreamPromise = new $Promise(() => { });
  this._handlerGroups.push({
    successCb: typeof successCb === 'function' ? successCb : false,
    errorCb: typeof errorCb === 'function' ? errorCb : false,
    downstreamPromise,
  });
  this._callHandlers();
  return downstreamPromise;
}

$Promise.prototype.catch = function (errorCb) {
  return this.then(null, errorCb)
}



module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
