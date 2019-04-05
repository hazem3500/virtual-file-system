import Promise from 'bluebird';

export default function (condition, action) {
    const resolver = Promise.defer();

    const loop = () => {
        if (!condition()) return resolver.resolve();
        return Promise.cast(action())
            .then(loop)
            .catch((...args) => resolver.reject(...args));
    };

    process.nextTick(loop);

    return resolver.promise;
}
