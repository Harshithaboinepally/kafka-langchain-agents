from kafka import KafkaProducer
import json, sys

question = input("Enter your question: ")

producer = KafkaProducer(
    bootstrap_servers="localhost:9092",
    value_serializer=lambda x: json.dumps(x).encode("utf-8"),
)
producer.send("inbox", {"question": question})
producer.flush()
print("Question sent to Kafka topic 'inbox'")
