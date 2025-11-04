from kafka import KafkaConsumer, KafkaProducer
import json, time

consumer = KafkaConsumer(
    "inbox",
    bootstrap_servers="localhost:9092",
    auto_offset_reset="earliest",
    group_id="planner-group",
    value_deserializer=lambda x: json.loads(x.decode("utf-8")),
)
producer = KafkaProducer(
    bootstrap_servers="localhost:9092",
    value_serializer=lambda x: json.dumps(x).encode("utf-8"),
)

print(" Planner ready...")
for msg in consumer:
    q = msg.value["question"]
    print(f" Received question: {q}")
    plan = f"1. Understand the question\n2. Search relevant info\n3. Write a concise answer"
    producer.send("tasks", {"plan": plan, "question": q})
    producer.flush()
    print(" Sent task plan.\n")
    time.sleep(1)