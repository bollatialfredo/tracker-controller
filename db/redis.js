const redis = require('redis');

const client = createClient({url: process.env.REDISS_HOST});
client.on('error', (err) => console.log('Redis Client Error', err));
client.on('connect', (msg) => console.log('Redis Client Connected', msg));

const connect = async ()=>{
  try {
    await client.connect();
  } catch (error) {
    console.error(error);    
  }
  await getString();
  await getList();
}

const getString = async ()=>{
  try {
    const value = await client.get('text');
    console.log(value);
  } catch (error) {
    console.log(error);
  }
}

const getList = async ()=>{
  try {
    const value = await client.lRange('test', 0, 1);
    console.log(value);
  } catch (error) {
    console.log(error);
  }
}

connect();
