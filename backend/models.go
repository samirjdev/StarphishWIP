package main

type Email struct {
    ID         string `bson:"_id,omitempty"`
    Title      string `bson:"title"`
    Content    string `bson:"content"`
    IsPhishing bool   `bson:"isPhishing"`
}

