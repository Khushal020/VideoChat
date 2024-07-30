export default () => {
    return {    
        redis: {
            'host': process.env.REDIS_HOST,
            'port': process.env.REDIS_PORT,
            'url': `${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
        }
    }
};