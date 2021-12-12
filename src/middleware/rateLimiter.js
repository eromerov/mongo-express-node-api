//ref: https://blog.logrocket.com/rate-limiting-node-js/

import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
});

export default limiter;