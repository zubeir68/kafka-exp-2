const { Kafka } = require('kafkajs');
const program = require('commander');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

const kafka = new Kafka({
    clientId: 'test',
    brokers: ['localhost:9092']
})

const run =  async () => {
    const producer = kafka.producer()
    
    await producer.connect()
    await producer.send({
        topic: 'test',
        messages: [
            { value: "My kafka stream is cooler then yours" }
        ]
    });
    
    const consumer = kafka.consumer({groupId: 'test-group'})
    
    await consumer.connect()
    await consumer.subscribe({ topic: 'test'})

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log("OUTPUT: ", {
                value: message.value.toString()
            });
            
        }
    })

    await consumer.stop();
}

run();
