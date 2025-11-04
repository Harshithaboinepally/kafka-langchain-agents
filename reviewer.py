from kafka import KafkaConsumer, KafkaProducer
import json, time

consumer = KafkaConsumer(
    "drafts",
    bootstrap_servers="localhost:9092",
    auto_offset_reset="earliest",
    group_id="reviewer-group",
    value_deserializer=lambda x: json.loads(x.decode("utf-8")),
)
producer = KafkaProducer(
    bootstrap_servers="localhost:9092",
    value_serializer=lambda x: json.dumps(x).encode("utf-8"),
)

print(" Reviewer ready...")
for msg in consumer:
    draft = msg.value
    print(f" Reviewing draft for: {draft['question']}")
    approved = {
        "question": draft["question"],
        "answer": draft["draft"],
        "status": "approved",
    }
    producer.send("final", approved)
    producer.flush()
    print(" Approved and sent to final.\n")
    time.sleep(1)
