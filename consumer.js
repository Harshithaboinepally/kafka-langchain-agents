/**
 * Kafka Consumer - User Management Microservice
 * Handles CRUD operations via Kafka messaging
 */

const kafka = require("kafka-node");
const { v4: uuidv4 } = require("uuid");
const validator = require("validator");

// --- Kafka Configuration ---
const client = new kafka.KafkaClient({ kafkaHost: "127.0.0.1:9092" });


// Consumer listens to "request_topic"
const consumer = new kafka.Consumer(
  client,
  [{ topic: "request_topic", partition: 0 }],
  { autoCommit: true }
);

// Producer sends responses to "response_topic"
const producer = new kafka.Producer(client);

// In-memory User Store
let users = new Map();

// --- Producer Event Listeners ---
producer.on("ready", () => console.log(" Producer is ready"));
producer.on("error", (err) => console.error(" Producer error:", err));

// --- Consumer Event Listeners ---
consumer.on("error", (err) => console.error(" Consumer error:", err));

consumer.on("message", async (message) => {
  console.log("\n" + "=".repeat(60));
  console.log(" Received message:", message.value);

  try {
    const payload = JSON.parse(message.value);
    const { correlationId, replyTo, data } = payload;

    const responseData = processUserRequest(data);

    const responsePayload = [
      {
        topic: replyTo,
        messages: JSON.stringify({
          correlationId,
          data: responseData,
          error: null,
          processedAt: new Date().toISOString(),
        }),
        partition: 0,
      },
    ];

    producer.send(responsePayload, (err) => {
      if (err) console.error(" Error sending response:", err);
      else console.log(" Response sent successfully");
    });
  } catch (err) {
    console.error(" Error processing message:", err);
  }
});

// --- User Management Logic ---
function processUserRequest(data) {
  switch (data.operation) {
    case "CREATE_USER": {
      const { name, email, age } = data;
      if (!name || !validator.isEmail(email) || age <= 0) {
        return { success: false, message: "Invalid input data" };
      }
      const userId = uuidv4();
      users.set(userId, { userId, name, email, age });
      return { success: true, userId, message: "User created" };
    }

    case "GET_USER": {
      const user = users.get(data.userId);
      return user
        ? { success: true, user }
        : { success: false, message: "User not found" };
    }

    case "UPDATE_USER": {
      const user = users.get(data.userId);
      if (!user) return { success: false, message: "User not found" };
      const updatedUser = { ...user, ...data.updates };
      users.set(data.userId, updatedUser);
      return { success: true, user: updatedUser };
    }

    case "DELETE_USER": {
      if (users.delete(data.userId))
        return { success: true, message: "User deleted" };
      return { success: false, message: "User not found" };
    }

    case "LIST_USERS": {
      const allUsers = Array.from(users.values());
      return { success: true, users: allUsers, count: allUsers.length };
    }

    default:
      return { success: false, message: "Invalid operation" };
  }
}

// --- Graceful Shutdown ---
process.on("SIGINT", () => {
  console.log("\n Shutting down consumer...");
  consumer.close(true, () => process.exit(0));
});

console.log("Kafka Consumer Service Started");
console.log("Listening on 'request_topic'...");
console.log("Press Ctrl+C to stop\n");
