package queue

import (
	"log"
	"os"

	"github.com/streadway/amqp"
)

type RabbitMQ struct {
	User              string
	Password          string
	Host              string
	Port              string
	Vhost             string
	ConsumerQueueName string
	ConsumerName      string
	AutoAck           bool
	Args              amqp.Table
	Channel           *amqp.Channel
}

func NewRabbitMQ() *RabbitMQ {
	rabbitMQArgs := amqp.Table{}
	rabbitMQArgs["x-dead-letter-exchange"] = os.Getenv("RABBITMQ_DLX")

	rabbitMQ := RabbitMQ{
		User:              os.Getenv("RABBITMQ_DEFAULT_USER"),
		Password:          os.Getenv("RABBITMQ_DEFAULT_PASS"),
		Host:              os.Getenv("RABBITMQ_DEFAULT_HOST"),
		Port:              os.Getenv("RABBITMQ_DEFAULT_PORT"),
		Vhost:             os.Getenv("RABBITMQ_DEFAULT_VHOST"),
		ConsumerQueueName: os.Getenv("RABBITMQ_CONSUMER_QUEUE_NAME"),
		ConsumerName:      os.Getenv("RABBITMQ_CONSUMER_NAME"),
		AutoAck:           false,
		Args:              rabbitMQArgs,
	}

	return &rabbitMQ
}

func (rabbit *RabbitMQ) Connect() *amqp.Channel {
	dsn := "amqp://" + rabbit.User + ":" + rabbit.Password + "@" + rabbit.Host + ":" + rabbit.Port + rabbit.Vhost
	conn, err := amqp.Dial(dsn)
	failOnError(err, "Failed to connect to RabbitMQ")

	rabbit.Channel, err = conn.Channel()
	failOnError(err, "Failed to open a channel")

	return rabbit.Channel
}

func (rabbit *RabbitMQ) Consume(messageChannel chan amqp.Delivery) {

	q, err := rabbit.Channel.QueueDeclare(
		rabbit.ConsumerQueueName, // name
		true,                     // durable
		false,                    // delete when usused
		false,                    // exclusive
		false,                    // no-wait
		rabbit.Args,              // arguments
	)
	failOnError(err, "failed to declare a queue")

	incomingMessage, err := rabbit.Channel.Consume(
		q.Name,              // queue
		rabbit.ConsumerName, // consumer
		rabbit.AutoAck,      // auto-ack
		false,               // exclusive
		false,               // no-local
		false,               // no-wait
		nil,                 // args
	)
	failOnError(err, "Failed to register a consumer")

	go func() {
		for message := range incomingMessage {
			log.Println("Incoming new message")
			messageChannel <- message
		}
		log.Println("RabbitMQ channel closed")
		close(messageChannel)
	}()
}

func (rabbit *RabbitMQ) Notify(message string, contentType string, exchange string, routingKey string) error {

	err := rabbit.Channel.Publish(
		exchange,   // exchange
		routingKey, // routing key
		false,      // mandatory
		false,      // immediate
		amqp.Publishing{
			ContentType: contentType,
			Body:        []byte(message),
		},
	)

	if err != nil {
		return err
	}

	return nil
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}
