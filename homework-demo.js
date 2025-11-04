const kafka = require("kafka-node");
const { v4: uuidv4 } = require("uuid");

const client = new kafka.KafkaClient({ kafkaHost: "127.0.0.1:9092" });
const producer = new kafka.Producer(client);
const consumer = new kafka.Consumer(client, [{ topic: "response_topic" }], { autoCommit: true });

let firstId = null;

function send(data) {
  producer.send(
    [{ topic: "request_topic", messages: JSON.stringify({ correlationId: uuidv4(), replyTo: "response_topic", data }) }],
    (err) => err && console.error(" Send error:", err)
  );
}

producer.on("ready", () => {
  console.log("\n Demo started");
  send({ operation: "CREATE_USER", name: "Alice", email: "alice@example.com", age: 25 });
  send({ operation: "CREATE_USER", name: "Bob", email: "bob@example.com", age: 30 });
  send({ operation: "CREATE_USER", name: "Charlie", email: "charlie@example.com", age: 35 });

  setTimeout(() => send({ operation: "LIST_USERS" }), 2000);
  setTimeout(() => { if (firstId) send({ operation: "GET_USER", userId: firstId }); }, 4000);
  setTimeout(() => { if (firstId) send({ operation: "UPDATE_USER", userId: firstId, updates: { age: 40 } }); }, 6000);
  setTimeout(() => { if (firstId) send({ operation: "DELETE_USER", userId: firstId }); }, 8000);
  setTimeout(() => send({ operation: "LIST_USERS" }), 10000);
});

consumer.on("message", (msg) => {
  const resp = JSON.parse(msg.value);
  console.log("\n", resp);
  if (resp.data?.userId && !firstId) firstId = resp.data.userId;
});
