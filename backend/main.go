package main

import (
    "context"
    "encoding/json"
    "log"
    "net/http"
    "os"
    "time"
	"math/rand"
	"fmt"

    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/bson"
)



var client *mongo.Client
var mongoURI string

// Config represents the structure of the configuration file
type Config struct {
	MongoURI string `json:"mongoURI"`
}

// Shuffle shuffles the slice of Email.
func Shuffle(emails []Email) {
	rand.Seed(time.Now().UnixNano()) // Ensure a different seed each time
	rand.Shuffle(len(emails), func(i, j int) {
		emails[i], emails[j] = emails[j], emails[i] // Swap the elements
	})
	fmt.Println("Shuffled emails:", emails[:2]) // Print first two to verify
}

func main() {
	// Read configuration
	configFile, err := os.Open("config.json")
	if err != nil {
		log.Fatal("Error opening configuration file:", err)
	}
	defer configFile.Close()

	var config Config
	decoder := json.NewDecoder(configFile)
	if err := decoder.Decode(&config); err != nil {
		log.Fatal("Error decoding configuration:", err)
	}
	mongoURI = config.MongoURI

	// Initialize Gin
	router := gin.Default()

	// CORS for http://localhost:3000 origins, adjust as needed
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		AllowCredentials: true,
	}))

	// Connect to MongoDB
	var mongoErr error // Declare mongoErr instead of err
	client, mongoErr = mongo.NewClient(options.Client().ApplyURI(mongoURI))
	if mongoErr != nil {
		log.Fatal(mongoErr)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	mongoErr = client.Connect(ctx)
	if mongoErr != nil {
		log.Fatal(mongoErr)
	}
	defer client.Disconnect(ctx)

	// Verify connection
	mongoErr = client.Ping(ctx, nil)
	if mongoErr != nil {
		log.Fatal("Could not connect to MongoDB: ", mongoErr)
	} else {
		log.Println("Connected to MongoDB")
	}

	// Define routes
	router.GET("/api/emails", getEmails)

	// Start server
	router.Run(":8080")
}

func getEmails(c *gin.Context) {
	var emails []Email
	collection := client.Database("PhishingEmails").Collection("emails")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching emails"})
		return
	}
	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var email Email
		if err = cursor.Decode(&email); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Error decoding email data"})
			return
		}
		emails = append(emails, email)
	}

	// Shuffle the emails before sending them to the client
	Shuffle(emails)

	c.JSON(http.StatusOK, emails)
}