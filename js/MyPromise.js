var MyPromise = /** @class */ (function () {
    function MyPromise(executor) {
        this._state = "pending" /* PromiseState.PENDING */;
        this._value = undefined;
        try {
            executor(this._resolve.bind(this), this._reject.bind(this));
        }
        catch (error) {
            console.log('error: ', error);
            this._reject(error);
        }
    }
    MyPromise.prototype._resolve = function (data) {
        this._changeState("fulfilled" /* PromiseState.FULFILLED */, data);
    };
    MyPromise.prototype._reject = function (reason) {
        this._changeState("rejected" /* PromiseState.REJECTED */, reason);
    };
    MyPromise.prototype._changeState = function (state, value) {
        if (this._state !== "pending" /* PromiseState.PENDING */)
            return;
        this._state = state;
        this._value = value;
    };
    return MyPromise;
}());
var a = new MyPromise(function (resolve, reject) {
    throw Error('123');
    setTimeout(function () {
        resolve(1);
    }, 1000);
});
