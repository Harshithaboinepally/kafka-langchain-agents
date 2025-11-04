from kafka import KafkaConsumer, KafkaProducer
import json, time
from langchain_ollama import OllamaLLM

consumer = KafkaConsumer(
    "tasks",
    bootstrap_servers="localhost:9092",
    auto_offset_reset="earliest",
    group_id="writer-group",
    value_deserializer=lambda x: json.loads(x.decode("utf-8")),
)
producer = KafkaProducer(
    bootstrap_servers="localhost:9092",
    value_serializer=lambda x: json.dumps(x).encode("utf-8"),
)
llm = OllamaLLM(model="mistral")

print("Writer ready...")
for msg in consumer:
    data = msg.value
    q, plan = data["question"], data["plan"]
    print(f"Received plan for: {q}")
    draft = llm.invoke(f"Question: {q}\nPlan: {plan}\nWrite a short 3-sentence answer.")
    producer.send("drafts", {"question": q, "draft": draft})
    producer.flush()
    print("Sent draft.\n")
    time.sleep(1)
